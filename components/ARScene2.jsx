import { StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import {
  ViroARScene,
  ViroFlexView,
  ViroText,
  ViroTrackingStateConstants,
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
  const [radius, setRadius] = useState(300);
  const [venues, setVenues] = useState([]);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [reviewIndexArr, setReviewIndexArr] = useState([])
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [nearbyVenues, setNearbyVenues] = useState([]);
  const [selectedVenueId, setSelectedVenueId] = useState(null);
  const [unfilteredReviews, setUnfilteredReviews] = useState([])


  //console.log(reviews)

  useEffect(() => {
    fetchVenues()
      .then((response) => {
        //console.log(response.venues, "response");
        setVenues(response.venues);
        // setLoading(false);
      })
      .catch((error) => {
        //     setError(error.response);
        // setLoading(false);
      });

    fetchUsers()
      .then((response) => {
        //console.log(response, "response");
        setUsers(response);
      })
      .catch((error) => {
        //setError(error);
        // setLoading(false);
      });
    // fetchVenueById(venue_id)
    //   .then((response) => {
    //     console.log(response, "id");
    //     setData1(response.venue);
    //     setLoading(false);
    //   })
    //   .catch((error) => {
    //     setError(error);
    //     setLoading(false);
    //   });
  }, []);

  // useEffect(() => {
  //   fetchVenues()
  //     .then((response) => {
  //       setReviews(response.venues);
  //       //  setLoading(false);
  //     })
  //     .catch((error) => {
  //       //setError(error.response);
  //       //  setLoading(false);
  //     });

  //   fetchReviews(selectedVenueId)
  //     .then((response) => {
  //       setNewReviews(response.reviews);
  //       //  setLoading(false);
  //     })
  //     .catch((error) => {
  //       //setError(error.response);
  //       //  setLoading(false);
  //     });
  // }, [selectedVenueId]);

  // useEffect(() => {
  //   setReviewIndexArr(reviewIndexArr => ({...reviewIndexArr, [i]: 1}))
  // }, [nearbyVenues])

  useEffect(() => {
    const fetchVenueData = async () => {
      if (position) {
        const { latitude, longitude } = position;
        // Filter venue data based on proximity to current location
        if (venues){
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
          
          console.log('Nearby >>> ', nearbyVenues);

        }

          //fetch reviews (can get duplicates and unordered)
          nearbyVenues.forEach(venue => {
            fetchReviews(venue.venue_id).then((res) => {
              const newReviews = res.reviews
              setUnfilteredReviews([...unfilteredReviews, newReviews])
            })
            .catch(error => {
              //error handling
            })
          })
          //algorithm that filters duplicate reviews
          const item_order = nearbyVenues.map(p=>p.venue_id)
          setReviews(
            unfilteredReviews.filter((t={},a=>!(t[a]=a in t))).slice()
            .sort((a, b) => {
              var A = a[0].venue_id, B = b[0].venue_id;
    
              if (item_order.indexOf(A) > item_order.indexOf(B)) {
                return 1;
              } else {
                return -1;
              }
            }
              )
          )  
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
        distanceFilter: 2, // Update location when the device moves at least 2 meters
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

  // cycle through reviews
  const onReviewClick = () => {
    if (reviews.length > 0) {
      // const venueId =
      //   reviews[0].comments[reviewIndex] &&
      //   reviews[0].comments[reviewIndex].venue_id;
      // const venueWithComments = reviews.find(
      //   (venue) => venue.venue_id === venueId
      // );
      if (reviewIndexArr.length === 0){
        for (let i = 0; i < nearbyVenues.length; i++) {
          
        }
      }
      setReviewIndexArr({...reviewIndexArr, 0 : 10})
      const commentsForVenue = reviews
      let nextIndex = reviewIndex + 1;

      if (commentsForVenue && commentsForVenue.length > 0) {
        nextIndex = nextIndex % commentsForVenue.length;
      }
      setReviewIndex(nextIndex);
    }
  };

  const onClickState = (stateValue, position, source) => {
    if (stateValue === 3) {
      onReviewClick();
    }
  };

  //go back to the lastest review ()
  const onResetReviewsClick = () => {
    setReviewIndex(0);
  };

  //add review ()
  const onAddReviewClick = (venue_id, place_name) => {
    //console.log(venue_id)
    setSelectedVenueId(venue_id, place_name);
    navigation.navigate("CommentPage", { venue_id, place_name });
  };

   // decide styling of the average rating bar ()
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

  return (
    <ViroARScene onTrackingUpdated={onInitialized}>
      {console.log(reviews)}
      {console.log(reviewIndexArr)}
      {nearbyVenues &&
        nearbyVenues.length > 0 &&
        reviews.length === nearbyVenues.length &&
        nearbyVenues.map((venue, index) => (

            // THE MAIN REVIEW CARD CONTAINER
              <ViroFlexView
                style={styles.venueInfoAndReviewsContainer}
                key={index}
                id={index}
                position={[0, index * -4, -10]}
                transformBehaviors={["billboard"]}
                
              >

            {/* THE PARTICULAR VENUE NAME HEADER */}
          <ViroFlexView  style={styles.displayedVenueTitleBar} >
            <ViroText
              style={styles.displayedVenueTitleBarText}
              text={`${venue.place_name}`}
              position={[0, index * 0.5, -2]}
            />
          </ViroFlexView>

          {/* THE AVERAGE RATING VISUAL */}
          <ViroFlexView style={styles.displayedReviewAvgRatingVisual} >
            <ViroFlexView style={styles.avg1Star} />
            {parseInt(venue.average_star_rating) >= 2 && <ViroFlexView style={styles.avg2Star} />}
            {parseInt(venue.average_star_rating) >= 3 && <ViroFlexView style={styles.avg3Star} />}
            {parseInt(venue.average_star_rating) >= 4 && <ViroFlexView style={styles.avg4Star} />}
            {parseInt(venue.average_star_rating) === 5 && <ViroFlexView style={styles.avg5Star} />}
          </ViroFlexView>

          {/* THE AVERAGE RATING TEXT BAR */}
          <ViroFlexView style={[getRatingStyle(venue)]}>
            <ViroText
            style={styles.displayedVenueAvgRatingBarText}
            text={`Average Rating: ${venue.average_star_rating}, from ${reviews[index].length} Reviews`}
          
            />
          </ViroFlexView>

         {/* THE REVIEW BODY AND INDIVIDUAL REVIEW RATING */}
         <ViroFlexView style={styles.displayedReviewBody}>
          
            <ViroText style={styles.displayedReviewBodyText} 
            text={` ${reviews[index][reviewIndex].author} rated ${reviews[index][reviewIndex].star_rating} Stars \n ${reviews[index][reviewIndex].body}`} 
            />

          </ViroFlexView>

    
         {/* bigdady button bar */}
         <ViroFlexView style={styles.buttonBar}>

            {/* ADD REVIEW BUTTON */}
            <ViroFlexView
              style={styles.addReviewButton}
              onClickState={onAddReviewClick}
            >
              <ViroText
                style={styles.addReviewButtonText}
                text={"Add a Review"}
              />
            </ViroFlexView> 

            {/* BLANK BUTTTON*/}
            <ViroFlexView
              style={styles.anotherOneButton}
              // onClickState={onResetReviewsClick}
            >
              <ViroText
                style={styles.anotherOneButtonText}
                text={"Another One"}
              />
            </ViroFlexView>

            {/* BACK TO TOP BUTTON */}
            <ViroFlexView
              style={styles.mostRecentReviewButton}
              onClickState={onResetReviewsClick}
            >
              <ViroText
                style={styles.mostRecentReviewButtonText}
                text={"Back to Top"}
              />
            </ViroFlexView>
          
             {/* NEXT BUTTON */}
            <ViroFlexView style={styles.displayedNextReviewButton}>
              <ViroText
                style={styles.displayedReviewNextButtonText}
                text={`Next Review >`}
                onClickState={onClickState}
              />
            </ViroFlexView>

          </ViroFlexView>

        </ViroFlexView>
      ))}
    </ViroARScene>
  );
};

export default ARScene2;