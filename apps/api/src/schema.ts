export const typeDefs = /* GraphQL */ `
  type Money { amount: Float! currency: String! }
  type PricePoint { t: String! base: Float! final: Float! stock: String! seller: String }
  type OfferBreakdown { label: String! delta: Float! }
  type Offer {
    final: Money!
    breakdown: [OfferBreakdown!]!
    seller: String
    stock: String
    updatedAt: String!
  }
  type Product {
    id: ID!
    marketplace: String!
    title: String!
    image: String
    currency: String!
    sparkline(range: String!): [PricePoint!]!
    currentOffer: Offer!
    forecast(range: String!): [PricePoint!]!
    verdict: Verdict!
  }
  type Verdict { decision: String! prob: Float! confidence: Float! reason: String! }
  type Alert { id: ID! type: String! params: String! active: Boolean! }

  type Query {
    product(id: ID!, marketplace: String!): Product
    search(q: String!, marketplace: String!, limit: Int = 10): [Product!]!
  }

  type Mutation {
    setAlert(productId: ID!, marketplace: String!, type: String!, params: String!): Alert!
    deleteAlert(id: ID!): Boolean!
  }
`;