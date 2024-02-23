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

import { calculateDistance } from "../utils";

// Import Fake(OWN) venue data

import { apiCall } from "../utils/apiCall";

const ARScene2 = () => {
  const navigation = useNavigation();

  const [text, setText] = useState("Initializing AR...");
  const [position, setPosition] = useState(null);
  const [radius, setRadius] = useState(14300000000);
  const [reviews, setReviews] = useState([]);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [allVenues, setAllVenues] = useState([])
  const [closestVenue, setClosestVenue] = useState({})

  useEffect(() => {
    apiCall().get('/venues').then(({data : {venues}}) => {
      setAllVenues(venues)
    })
    .catch(error => {
      //some sort of error handling
      console.error("Error loading venues", error);
    })
  }, [])

  useEffect(() => {
    Geolocation.getCurrentPosition(
      (position) => {
        //console.log("My Location ==>>", position);
        setPosition(position.coords);
      },
      (error) => {
        console.error("Error getting current position:", error);
      }
    );
  }, [position]);

  useEffect(() => {
    const fetchVenueData = async () => {
      if (position) {
        const { latitude, longitude } = position;
        // Filter venue data based on proximity to current location
        const distances = []
        const nearbyVenues = allVenues.filter((venue) => {
          const venueLocation = { latitude: Number(venue.latitude), longitude: Number(venue.longitude)}
          if (venueLocation) {
            const distance = calculateDistance(
              latitude,
              longitude,
              venueLocation.latitude,
              venueLocation.longitude
            );
            distances.push(distance)
            venue["distance"] = distance
           //console.log(`Distance to ${venue.place_name}: ${distance} meters`);
            return distance <= radius;
          }
          return false;
        });
        const shortestDistance = Math.min.apply(null, distances)
        const nearestVenue = nearbyVenues.filter(venue => venue["distance"] === shortestDistance)
        setClosestVenue(nearestVenue[0])
        apiCall().get(`/venues/${closestVenue.venue_id}/reviews`).then(({data: {reviews}}) => {
          setReviews(reviews)
        })
        .catch(error => {
        console.error("Error loading reviews", error);
          //error handling
        })

        // const venuesWithComments = nearbyVenues.map((venue) => {
        //   const commentsForVenue = commentData.comments.filter(
        //     (comment) => comment.venue_id === venue.venue_id
        //   );
        //   return {
        //     ...venue,
        //     comments: commentsForVenue,
        //   };
        // });
        // setReviews(venuesWithComments);
      }
    };
    fetchVenueData();
  }, [position]);



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
      //const venueId = reviews[0].comments[reviewIndex] && reviews[0].comments[reviewIndex].venue_id;
      //const venueWithComments = reviews.find((venue) => venue.venue_id === venueId);
      //const commentsForVenue = reviews
      let nextIndex = reviewIndex + 1;
      commentsForVenue = reviews

    if (reviews && reviews.length > 0) {
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

  //add review
  const onAddReviewClick = () => {
    navigation.navigate("CommentPage");
  };

  return (
    <ViroARScene onTrackingUpdated={onInitialized}>
      {reviews.map((review, index) => (
        <ViroFlexView
          key={index}
          id={review.venue_id}
          height={4}
          width={6}
          position={[0, 0, -10]}
          transformBehaviors={["billboard"]}
          backgroundColor={"black"}
          onClickState={onClickState}
          style={{ opacity: 0.7 }}
        >
          <ViroFlexView
            backgroundColor={"white"}
            style={{ flex: 0.2, flexDirection: "row" }}
          >
            <ViroFlexView
              backgroundColor={"navy"}
              style={{ flex: 1, flexDirection: "row" }}
            >
              <ViroText
                text={`${closestVenue.type}:`}
                fontSize={20}
                position={[0, 0.5, -2]}
                style={{ color: "white" }}
              />
              <ViroText
                text={`${closestVenue.place_name}`}
                fontSize={30}
                position={[0, index * 0.5, -2]}
                style={{
                  color: "black",
                  flex: 1,
                  textAlignVertical: "center",
                  textAlign: "center",
                }}
              />
            </ViroFlexView>
          </ViroFlexView>

          <ViroFlexView
            backgroundColor={"yellow"}
            style={{ flex: 0.25, flexDirection: "row" }}
          >
            <ViroText
              style={{
                color: "black",
                flex: 0.5,
                textAlignVertical: "center",
                textAlign: "center",
              }}
              text={`${reviews.length} Reviews`}
              position={[0, index * 0.5, -2]}
              fontSize={30}
            />
            <ViroText
              style={{
                color: "black",
                flex: 0.5,
                textAlignVertical: "center",
                textAlign: "center",
              }}
              text={`${closestVenue.average_star_rating} Stars`}
              position={[0, index * 0.5, -2]}
              fontSize={30}
            />
          </ViroFlexView>

          <ViroFlexView
            backgroundColor={"black"}
            style={{ flex: 1, flexDirection: "row" }}
          >
            <ViroText
              style={{
                flex: 0.8,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
              text={`${reviews[reviewIndex].author}: ${reviews[reviewIndex].body}`}
              fontSize={20}
              position={[0, -0.2, -2]}
            />
            <ViroText
              style={{
                flex: 0.2,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "",
              }}
              text={`${reviews[reviewIndex].star_rating} Stars`}
              fontSize={20}
            />
          </ViroFlexView>
        </ViroFlexView>
      ))}

      <ViroFlexView
        style={{ opacity: 0.7 }}
        height={1.5}
        width={2.5}
        position={[-2, -3.5, -12]}
        backgroundColor={"black"}
        onClickState={onResetReviewsClick}
      >
        <ViroText
          style={{
            color: "white",
            flex: 1,
            textAlignVertical: "center",
            textAlign: "center",
          }}
          text={"Back to Top"}
          fontSize={30}
        />
      </ViroFlexView>

      <ViroFlexView
        style={{ opacity: 0.7 }}
        height={1.5}
        width={2.5}
        position={[2, -3.5, -12]}
        backgroundColor={"green"}
        onClickState={onAddReviewClick}
      >
        <ViroText
          style={{
            color: "black",
            flex: 1,
            textAlignVertical: "center",
            textAlign: "center",
          }}
          text={"Add a Review"}
          fontSize={30}
        />
      </ViroFlexView>
    </ViroARScene>
  );
};

const styles = StyleSheet.create({
  helloWorldTextStyle: {
    fontStyle: "bold",
    fontSize: 20,
    color: "#000",
    textAlign: "center",
  },
});

export default ARScene2;
