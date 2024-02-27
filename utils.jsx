// Function to calculate distance between two points using Haversine formula
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d * 1000; // Convert to meters
};

const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
};

export const fetchVenues = () => {
  return fetch(`https://reviewar-be.onrender.com/api/venues`)
    .then((response) => {
      return response.json();
    })
    .then((data) => data);
};

// export const fetchVenueById = (venue_id) => {
//   return fetch(
//     `https://reviewar-be.onrender.com/api/venues/${3}`
//   ).then((response) => {
//     return response.json();
//   });
// };

export const fetchReviews = (venueId) => {
  return fetch(`https://reviewar-be.onrender.com/api/venues/${venueId}/reviews`)
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      return response;
    });
};

export const fetchUsers = () => {
  return fetch(`https://reviewar-be.onrender.com/api/users`)
    .then((response) => {
      return response.json();
    })
    .then((data) => data.users);
};

export const getReviewValue = (reviews, venue_id, property) => {
  let propertyValue = ""
  reviews.every(venueReviews => {
    if(venueReviews[0].venue_id === venue_id){
      propertyValue = venueReviews[0][property]
      return false
    }
  })
  return propertyValue
}

export const postReviews = (
  venue_id,
  user_id,
  author,
  place_name,
  body,
  star_rating
) => {
  return fetch(`https://reviewar-be.onrender.com/api/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      venue_id,
      user_id,
      author,
      place_name,
      body,
      star_rating,
    }),
  })
    .then((response) => {
      console.log(response.status);
      if (!response.ok) {
        throw new Error("Failed to post review");
      }
      return response.json();
    })
    .then((data) => {
      // Handle successful response
      console.log(data, "data");
      return data;
    })
    .catch((error) => {
      // Handle fetch or JSON parsing errors
      console.error("Error posting review:", error);
      throw error;
    });
};

