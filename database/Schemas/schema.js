const { gql } = require("apollo-server");

const typeDefs = gql`
  type Token {
    token: String
  }

  type Donor {
    id: ID!
    name: String
    email: String!
    password: String
    address: String
    donations: [Donation!]
  }

  type Organization {
    id: ID!
    name: String
    email: String
    password: String
    address: String
    products: [Product!]
    campaigns: [Campaign!]
    donationsReceived: [Donation!]
    baskets: [Basket!]
    campus: [String]
  }

  type Donation {
    id: ID!
    donor: Donor
    product: Product
    organization: Organization
    donationDate: String
    deliveryMethod: String
    address: String
    organizationCampus: String
    quantity: Int
  }

  type Campaign {
    id: ID!
    name: String
    organization: Organization
    products: [Product!]
    description: String
  }

  type Basket {
    id: ID!
    organization: Organization
    products: [Product!]
    recipient: String
    deliveryDate: String
  }

  type Product {
    id: ID!
    name: String!
    organization: Organization
    category: String
    expirationDate: String
    quantityNeeded: Int
    quantityDonated: Int
  }

  input DonorInput {
    name: String
    email: String
    password: String
    address: String
  }

  input OrganizationInput {
    name: String
    email: String
    password: String
    address: String
    campus: [String]
  }

  input DonationInput {
    productId: ID!
    donationDate: String
    deliveryMethod: String
    address: String
    organizationCampus: String
    quantity: Int
  }

  input CampaignInput {
    name: String
    productIds: [ID!]
    description: String
  }

  input BasketInput {
    productIds: [ID!]
    recipient: String
    deliveryDate: String
  }

  input ProductInput {
    name: String
    category: String
    expirationDate: String
    quantityNeeded: Int
    quantityDonated: Int
  }

  type CurrentUser {
    donor: Donor
    organization: Organization
  }

  type Query {
    getMe: CurrentUser

    getDonors: [Donor!]
    getOrganizations: [Organization!]
    getDonations: [Donation!]
    getCampaigns: [Campaign!]
    getBaskets: [Basket!]
    getProducts: [Product!]

    #getsById
    getDonor(id: ID!): Donor
    getOrganization(id: ID!): Organization
    getDonation(id: ID!): Donation
    getCampaign(id: ID!): Campaign
    getBasket(id: ID!): Basket
    getProduct(id: ID!): Product
  }

  type Mutation {
    login(email: String!, password: String!): Token!

    #Crear
    createDonor(input: DonorInput!): Donor!
    createOrganization(input: OrganizationInput!): Organization!
    createDonation(input: DonationInput!): Donation!
    createCampaign(input: CampaignInput!): Campaign!
    createBasket(input: BasketInput!): Basket!
    createProduct(input: ProductInput!): Product!

    #Update
    updateDonor(id: ID!, input: DonorInput): Donor!
    updateOrganization(id: ID!, input: OrganizationInput!): Organization!
    updateDonation(id: ID!, input: DonationInput!): Donation!
    updateCampaign(id: ID!, input: CampaignInput!): Campaign!
    updateBasket(id: ID!, input: BasketInput!): Basket!
    updateProduct(id: ID!, input: ProductInput!): Product!

    #Delete
    deleteDonor(id: ID!): ID
    deleteOrganization(id: ID!): ID
    deleteDonation(id: ID!): ID
    deleteCampaign(id: ID!): ID
    deleteBasket(id: ID!): ID
    deleteProduct(id: ID!): ID
  }
`;

module.exports = typeDefs;
