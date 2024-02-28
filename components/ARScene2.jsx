import React, { useState, useEffect } from "react";
import {
  ViroARScene,
  ViroFlexView,
  ViroText,
  ViroTrackingStateConstants,
  Viro3DObject,
  ViroAnimations,
  ViroImage,
} from "@viro-community/react-viro";
import Geolocation from "@react-native-community/geolocation";
import { useNavigation } from "@react-navigation/native";

import {
  calculateDistance,
  fetchReviews,
  fetchUsers,
  fetchVenues,
} from "../utils";

import styles from "../styles";

const ARScene2 = () => {
  const navigation = useNavigation();
  const [text, setText] = useState("Initializing AR...");
  const [position, setPosition] = useState(null);
  const [radius, setRadius] = useState(100);
  const [venues, setVenues] = useState([]);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [nearbyVenues, setNearbyVenues] = useState([]);
  const [selectedVenueId, setSelectedVenueId] = useState(null);
  const [starIosPosition, setIosStarPosition] = useState([0.1, 0.1, 0.1]);
  const [starPosition, setStarPosition] = useState([0, 0, 0]);
  const [starScale, setStarScale] = useState([0.1, 0.1, 0.1]);
  const [unfilteredReviews, setUnfilteredReviews] = useState([]);

  useEffect(() => {
    fetchVenues()
      .then((response) => {
        setVenues(response.venues);
      })
      .catch((error) => {});

    fetchUsers()
      .then((response) => {
        setUsers(response);
      })
      .catch((error) => {});
  }, []);

  useEffect(() => {
    const fetchVenueData = async () => {
      if (position) {
        const { latitude, longitude } = position;
        // Filter venue data based on proximity to current location
        const nearbyVenues = venues.filter((venue) => {
          if (venue.latitude && venue.longitude) {
            const distance = calculateDistance(
              latitude,
              longitude,
              venue.latitude,
              venue.longitude
            );

            return distance <= radius;
          }
          return false;
        });
        setNearbyVenues(nearbyVenues);
        console.log("Nearby >>> ", nearbyVenues);

        //fetch reviews (can get duplicates and unordered)
        nearbyVenues.forEach((venue) => {
          fetchReviews(venue.venue_id)
            .then((res) => {
              const newReviews = res.reviews;
              setUnfilteredReviews([...unfilteredReviews, newReviews]);
            })
            .catch((error) => {
              //error handling
            });
        });
        //algorithm that filters duplicate reviews
        const item_order = nearbyVenues.map((p) => p.venue_id);
        setReviews(
          unfilteredReviews
            .filter(((t = {}), (a) => !(t[a] = a in t)))
            .slice()
            .sort((a, b) => {
              var A = a[0].venue_id,
                B = b[0].venue_id;

              if (item_order.indexOf(A) > item_order.indexOf(B)) {
                return 1;
              } else {
                return -1;
              }
            })
        );
      }
    };
    fetchVenueData();
  }, [position]);

  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      (position) => {
        console.log("My Location ==>>", position);
        setPosition(position.coords);
      },
      (error) => {
        console.error("Error getting current position:", error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 1, // Update location when the device moves at least 5 meters
        timeout: 5000, // Cancel if location retrieval takes too long
      }
    );

    return () => {
      Geolocation.clearWatch(watchId);
    };
  }, []);

  function onInitialized(state, reason) {
    if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
      setText("AR tracking is normal!");
    } else if (state === ViroTrackingStateConstants.TRACKING_UNAVAILABLE) {
      setText(
        "Tracking is unavailable. Try moving to a different location or adjusting your device orientation."
      );
    }
  }

  useEffect(() => {
    if (reviews.length > nearbyVenues.length){
      setReviews(
        reviews.filter((review, index) => reviews.length / 2 > index)
      )
    }
  }, [reviews.length])

  // cycle through reviews
  const onReviewClick = (index) => {
    if (reviews.length > 0) {
      const reviewsForVenue = reviews;
      let nextIndex = reviewIndex + 1;
      if (reviewsForVenue[index][nextIndex] === undefined && reviewsForVenue.length > 0) {
        nextIndex = nextIndex % reviewsForVenue.length;
      }
      setReviewIndex(nextIndex);
    }

  };

  const onClickState = (stateValue, index) => {
    if (stateValue === 3) {
      onReviewClick(index);
    }
  };

  //go back to the lastest review ()
  const onResetReviewsClick = () => {
    setReviewIndex(0);
  };

  // add a BACK button maybe ?
  // const onBackReviewsClick = () => {
  //   setReviewIndex(/* go back logic */);
  // };

  //add review ()
  const onAddReviewClick = (venue_id, place_name) => {
    navigation.navigate("ReviewPage", { venue_id, place_name });
  };

  const getRatingStyle = (venue) => {
    const rating = parseFloat(venue.average_star_rating);
    if (rating >= 1 && rating < 2.1) {
      return styles.displayedVenueAvgRatingBarRed;
    } else if (rating >= 2.1 && rating < 3.1) {
      return styles.displayedVenueAvgRatingBarOrange;
    } else if (rating >= 3.1 && rating < 4.1) {
      return styles.displayedVenueAvgRatingBarYellow;
    } else if (rating >= 4.1 && rating < 5) {
      return styles.displayedVenueAvgRatingBarLightGreen;
    } else {
      return styles.displayedVenueAvgRatingBarGreen;
    }
  };

  useEffect(() => {
    if (nearbyVenues.length > 0 && reviews.length > 0) {
      // Conditions met, update star position and scale
      setStarPosition([0, -0.08, 0]);
      setStarScale([0.05, 0.05, 0.05]);

      setIosStarPosition([0, 0, 0]);


    }
  }, [nearbyVenues, reviews]);

  ViroAnimations.registerAnimations({
    rotate: {
      duration: 1000,
      properties: {
        rotateY: "+=90",
      },
    },
  });

  return (
    <ViroARScene onTrackingUpdated={onInitialized}>
      {console.log(reviews)}
      {!(nearbyVenues && nearbyVenues.length > 0 && reviews.length > 0) && (
        <>
          <ViroText
            text="Scanning..."
            position={[0, 0, -8]}
            style={{ fontSize: 60, color: "white" }}
          />
          <Viro3DObject
            source={require("../assets/dragon/Dragon.obj")} // Adjust the path as necessary
            // resources={require("../assets/binocular/Blank.mtl")}
            position={[2, 2, -30]} // Use the position prop passed to each Star instance
            scale={[0.025, 0.025, 0.025]} // Adjust scale as necessary
            rotation={[-90, 0, 0]}
            animation={{ name: "rotate", loop: true, run: true }}
            type="OBJ" // Assuming the star model is an OBJ file
          />
        </>
      )}
      {nearbyVenues &&
        nearbyVenues.length > 0 &&
        reviews.length > 0 &&
        reviews.length === nearbyVenues.length &&
        reviews.map((review, index) => (
          // THE MAIN REVIEW CARD CONTAINER
          <>
          <ViroFlexView
            style={styles.venueInfoAndReviewsContainer}
            key={index}
            position={[0, index * -4, -10]}
            transformBehaviors={["billboard"]}
          >
            {/* THE PARTICULAR VENUE NAME HEADER */}
            <ViroFlexView style={styles.displayedVenueTitleBar}>
              <ViroText
                style={styles.displayedVenueTitleBarText}
                text={`${nearbyVenues[index].place_name}`}
                position={[0, index * 0.5, -2]}
              />
            </ViroFlexView>

            {/* THE AVERAGE RATING VISUAL */}
            <ViroFlexView style={styles.displayedReviewAvgRatingVisual}>
              <ViroFlexView style={styles.avg1Star}>
                {Platform.OS === "ios" ? (
                  <ViroImage
                    height={0.2}
                    width={0.2}
                    position={starIosPosition} // Use the position prop passed to each Star instance
                    // scale={starScale} // Adjust scale as necessary
                    // placeholderSource={require("../assets/ReviewStar.png")}
                    source={require("../assets/ReviewStar.png")}
                  />
                ) : (
                  <Viro3DObject
                    source={require("../assets/stars/Star_v3.obj")} // Adjust the path as necessary
                    // resources={require("../assets/stars/Blank.mtl")}
                    position={starPosition} // Use the position prop passed to each Star instance
                    scale={starScale} // Adjust scale as necessary
                    rotation={[-90, 0, 0]}
                    animation={{ name: "rotate", loop: true, run: true }}
                    type="OBJ" // Assuming the star model is an OBJ file
                  />
                )}
              </ViroFlexView>
              {parseInt(nearbyVenues[index].average_star_rating) >= 2 && (
                <ViroFlexView style={styles.avg2Star}>
                  {Platform.OS === "ios" ? (
                    <ViroImage
                      height={0.2}
                      width={0.2}
                      position={starIosPosition} // Use the position prop passed to each Star instance
                      // scale={starScale} // Adjust scale as necessary
                      // placeholderSource={require("../assets/ReviewStar.png")}
                      source={require("../assets/ReviewStar.png")}
                    />
                  ) : (
                    <Viro3DObject
                      source={require("../assets/stars/Star_v3.obj")} // Adjust the path as necessary
                      // resources={require("../assets/stars/Blank.mtl")}
                      position={starPosition} // Use the position prop passed to each Star instance
                      scale={starScale} // Adjust scale as necessary
                      rotation={[-90, 0, 0]}
                      animation={{ name: "rotate", loop: true, run: true }}
                      type="OBJ" // Assuming the star model is an OBJ file
                    />
                  )}
                </ViroFlexView>
              )}
              {parseInt(nearbyVenues[index].average_star_rating) >= 3 && (
                <ViroFlexView style={styles.avg3Star}>
                  {Platform.OS === "ios" ? (
                    <ViroImage
                      height={0.2}
                      width={0.2}
                      position={starIosPosition} // Use the position prop passed to each Star instance
                      // scale={starScale} // Adjust scale as necessary
                      // placeholderSource={require("../assets/ReviewStar.png")}
                      source={require("../assets/ReviewStar.png")}
                    />
                  ) : (
                    <Viro3DObject
                      source={require("../assets/stars/Star_v3.obj")} // Adjust the path as necessary
                      // resources={require("../assets/stars/Blank.mtl")}
                      position={starPosition} // Use the position prop passed to each Star instance
                      scale={starScale} // Adjust scale as necessary
                      rotation={[-90, 0, 0]}
                      animation={{ name: "rotate", loop: true, run: true }}
                      type="OBJ" // Assuming the star model is an OBJ file
                    />
                  )}
                </ViroFlexView>
              )}
              {parseInt(nearbyVenues[index].average_star_rating) >= 4 && (
                <ViroFlexView style={styles.avg4Star}>
                  {Platform.OS === "ios" ? (
                    <ViroImage
                      height={0.2}
                      width={0.2}
                      position={starIosPosition} // Use the position prop passed to each Star instance
                      // scale={starScale} // Adjust scale as necessary
                      // placeholderSource={require("../assets/ReviewStar.png")}
                      source={require("../assets/ReviewStar.png")}
                    />
                  ) : (
                    <Viro3DObject
                      source={require("../assets/stars/Star_v3.obj")} // Adjust the path as necessary
                      // resources={require("../assets/stars/Blank.mtl")}
                      position={starPosition} // Use the position prop passed to each Star instance
                      scale={starScale} // Adjust scale as necessary
                      rotation={[-90, 0, 0]}
                      animation={{ name: "rotate", loop: true, run: true }}
                      type="OBJ" // Assuming the star model is an OBJ file
                    />
                  )}
                </ViroFlexView>
              )}
              {parseInt(nearbyVenues[index].average_star_rating) === 5 && (
                <ViroFlexView style={styles.avg5Star}>
                  {Platform.OS === "ios" ? (
                    <ViroImage
                      height={0.2}
                      width={0.2}
                      position={starIosPosition} // Use the position prop passed to each Star instance
                      // scale={starScale} // Adjust scale as necessary
                      // placeholderSource={require("../assets/ReviewStar.png")}
                      source={require("../assets/ReviewStar.png")}
                    />
                  ) : (
                    <Viro3DObject
                      source={require("../assets/stars/Star_v3.obj")} // Adjust the path as necessary
                      // resources={require("../assets/stars/Blank.mtl")}
                      position={starPosition} // Use the position prop passed to each Star instance
                      scale={starScale} // Adjust scale as necessary
                      rotation={[-90, 0, 0]}
                      animation={{ name: "rotate", loop: true, run: true }}
                      type="OBJ" // Assuming the star model is an OBJ file
                    />
                  )}
                </ViroFlexView>
              )}
            </ViroFlexView>

            {/* THE AVERAGE RATING TEXT BAR */}
            <ViroFlexView style={[getRatingStyle(nearbyVenues[index])]}>
              <ViroText
                style={styles.displayedVenueAvgRatingBarText}
                text={`Average Rating: ${nearbyVenues[index].average_star_rating}, from ${review.length} Reviews`}
              />
            </ViroFlexView>

            {/* THE REVIEW BODY AND INDIVIDUAL REVIEW RATING */}
            <ViroFlexView style={styles.displayedReviewBody}>
              <ViroText
                style={styles.displayedReviewBodyText}
                text={` ${review[reviewIndex].author}  rated  ${review[reviewIndex].star_rating} Stars and wrote: \n "${review[reviewIndex].body}"`}
              />
            </ViroFlexView>

            {/* bigdady button bar */}
            <ViroFlexView style={styles.buttonBar}>
              {/* ADD REVIEW BUTTON */}
              <ViroFlexView
                style={styles.addReviewButton}
                onClickState={() =>
                  onAddReviewClick(nearbyVenues[index].venue_id, nearbyVenues[index].place_name)
                }
              >
                <ViroText
                  style={styles.addReviewButtonText}
                  text={"Add a Review"}
                />
              </ViroFlexView>

              {/* BACK BUTTTON*/}
              {/* <ViroFlexView
                style={styles.anotherOneButton}
                // onClickState={onBackReviewsClick}
              >
                <ViroText style={styles.anotherOneButtonText} text={"< Back"} />
              </ViroFlexView> */}

              {/* MOST RECENT BUTTON */}
              <ViroFlexView
                style={styles.mostRecentReviewButton}
                onClickState={onResetReviewsClick}
              >
                <ViroText
                  style={styles.mostRecentReviewButtonText}
                  text={"Most Recent"}
                />
              </ViroFlexView>

              {/* NEXT BUTTON */}
              <ViroFlexView
                style={styles.displayedNextReviewButton}
                onClickState={(stateValue) => {onClickState(stateValue, index)}}
              >
                <ViroText
                  style={styles.displayedReviewNextButtonText}
                  text={`Next >`}
                />
              </ViroFlexView>
            </ViroFlexView>
          </ViroFlexView>
          </>
        ))}
    </ViroARScene>
  );
};

export default ARScene2;
