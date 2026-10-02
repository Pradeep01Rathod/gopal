/**
 * Mock data store for users and audited reviews
 */

export const sampleReviews = [
  {
    id: "rev-1",
    product: "UltraNoise ANC Headphones",
    rating: 5,
    text: "AMAZING PRODUCT!!! Best purchase of my entire life! Outstanding quality, blown away! 1000% recommended to everybody on earth!",
    isFake: true,
    confidence: 94
  },
  {
    id: "rev-2",
    product: "UltraNoise ANC Headphones",
    rating: 4,
    text: "Purchased this wireless headset about two weeks ago. The battery holds up for around 20 hours. Sound is clean and crisp with balanced bass.",
    isFake: false,
    confidence: 92
  }
];

export const users = [];
