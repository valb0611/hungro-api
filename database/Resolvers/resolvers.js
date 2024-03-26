const bcryptjs = require("bcryptjs");
const Donor = require("../../models/Donor");
const Organization = require("../../models/Organization");
const Donation = require("../../models/Donation");
const Campaign = require("../../models/Campaign");
const Basket = require("../../models/Basket");
const Product = require("../../models/Product");
const jwt = require("jsonwebtoken");

require("dotenv").config({ path: ".env" });

const resolvers = {
  // Queries
  Query: {
    getMe: async (_, __, ctx) => {
      if (!ctx.userId) throw new Error("Usuario no autenticado.");

      if (ctx.userType === "donor") {
        const donor = await Donor.findById(ctx.userId);
        if (!donor) throw new Error("Donor not found.");
        return { donor };
      } else if (ctx.userType === "organization") {
        const organization = await Organization.findById(ctx.userId).populate(
          "products"
        );
        if (!organization) throw new Error("Organization not found.");
        return { organization };
      } else {
        throw new Error("Invalid user type.");
      }
    },

    // Obtener donantes
    getDonors: async () =>
      await Donor.find().populate({
        path: "donations",
        populate: [
          { path: "product", model: "Product" },

          { path: "organization", model: "Organization" },
        ],
      }),

    getDonor: async (_, { id }) =>
      await Donor.findById(id).populate({
        path: "donations",
        populate: [
          { path: "product", model: "Product" },
          { path: "organization", model: "Organization" },
        ],
      }),

    // Obtener organizaciones

    getOrganizations: async () =>
      await Organization.find()
        .populate("products")
        .populate({
          path: "campaigns",
          populate: { path: "products", model: "Product" },
        })
        .populate({
          path: "baskets",
          populate: { path: "products", model: "Product" },
        })
        .populate({
          // Poblar 'donationsReceived'
          path: "donationsReceived",
          model: "Donation",
          populate: {
            // Poblar 'donor' dentro de cada 'donation'
            path: "donor",
            model: "Donor",
          },
        }),

    getOrganization: async (_, { id }) =>
      await Organization.findById(id)
        .populate("products")
        .populate({
          path: "campaigns",
          populate: { path: "products", model: "Product" },
        })
        .populate({
          path: "baskets",
          populate: { path: "products", model: "Product" },
        })
        .populate({
          // Poblar 'donationsReceived'
          path: "donationsReceived",
          model: "Donation",
          populate: {
            // Poblar 'donor' dentro de cada 'donation'
            path: "donor",
            model: "Donor",
          },
        }),

    // Obtener donaciones
    getDonations: async () => {
      return await Donation.find()
        .populate("donor")
        .populate({
          path: "product",
          populate: {
            path: "organization",
          },
        })
        .populate("organization");
    },

    getDonation: async (_, { id }) =>
      await Donation.findById(id)
        .populate("donor")
        .populate("product")
        .populate("organization"),

    // Obtener Campañas
    getCampaigns: async () =>
      await Campaign.find()
        .populate({
          path: "products",
          model: "Product",
        })
        .populate("organization"),
    getCampaign: async (_, { id }) =>
      await Campaign.findById(id)
        .populate({
          path: "products",
          model: "Product",
        })
        .populate("organization"),
    // Obtener canastas

    getBaskets: async () =>
      await Basket.find()
        .populate({
          path: "products",
          model: "Product",
        })
        .populate("organization"),
    getBasket: async (_, { id }) =>
      await Basket.findById(id)
        .populate({
          path: "products",
          model: "Product",
        })
        .populate("organization"),
    // Obtener productos
    getProducts: async () => await Product.find().populate("organization"),

    getProduct: async (_, { id }) =>
      await Product.findById(id).populate("organization"),
  },

  // Mutaciones
  Mutation: {
    login: async (_, { email, password }) => {
      // Primero verifica si el email corresponde a un Donor
      const donor = await Donor.findOne({ email });

      if (donor) {
        const correctPw = await bcryptjs.compare(password, donor.password);
        if (!correctPw) {
          throw new Error("Contraseña incorrecta");
        }

        return {
          token: jwt.sign(
            { userId: donor.id, userType: "donor" },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
          ),
        };
      }

      // Luego verifica si el email corresponde a una Organization
      const organization = await Organization.findOne({ email });
      if (organization) {
        const correctPw = await bcryptjs.compare(
          password,
          organization.password
        );
        if (!correctPw) {
          throw new Error("Contraseña incorrecta");
        }

        return {
          token: jwt.sign(
            { userId: organization.id, userType: "organization" },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
          ),
        };
      }

      throw new Error("Usuario no encontrado");
    },

    // Donor
    createDonor: async (_, { input }) => {
      const { email, password } = input;
      const donorExist = await Donor.findOne({ email });

      if (donorExist) {
        throw new Error("El usuario ya está registrado");
      }

      const salt = await bcryptjs.genSalt(10);
      input.password = await bcryptjs.hash(password, salt);

      const donor = new Donor(input);
      await donor.save();
      return donor;
    },

    updateDonor: async (_, { id, input }) => {
      return await Donor.findByIdAndUpdate(id, input, { new: true });
    },

    deleteDonor: async (_, { id }) => {
      await Donor.findByIdAndDelete(id);
      return id;
    },

    // Organization
    createOrganization: async (_, { input }) => {
      const { email, password } = input;
      const orgExist = await Organization.findOne({ email });

      if (orgExist) {
        throw new Error("La organización ya está registrada");
      }

      const salt = await bcryptjs.genSalt(10);
      input.password = await bcryptjs.hash(password, salt);

      const org = new Organization(input);
      await org.save();
      return org;
    },

    updateOrganization: async (_, { id, input }) => {
      return await Organization.findByIdAndUpdate(id, input, { new: true });
    },
    deleteOrganization: async (_, { id }) => {
      await Organization.findByIdAndDelete(id);
      return id;
    },

    //Product
    createProduct: async (_, { input }, ctx) => {
      if (!ctx.userId || ctx.userType !== "organization") {
        throw new Error("Organización no autenticada");
      }

      input.organization = ctx.userId; // Asigna la organización al producto

      const product = new Product(input);
      await product.save();

      await Organization.findByIdAndUpdate(ctx.userId, {
        $push: { products: product.id },
      });

      return product;
    },

    updateProduct: async (_, { id, input }) => {
      return await Product.findByIdAndUpdate(id, input, { new: true });
    },
    deleteProduct: async (_, { id }) => {
      await Product.findByIdAndDelete(id);
      return id;
    },

    // Campaign

    createCampaign: async (_, { input }, ctx) => {
      if (!ctx.userId || ctx.userType !== "organization") {
        throw new Error("Organización no autenticada");
      }

      // Añadir los productos a la campaña
      input.products = input.productIds;

      // Asignar la organización autenticada a la campaña
      input.organization = ctx.userId;

      const campaign = new Campaign(input);
      await campaign.save();

      // Update the organization's campaigns array to include the new campaign
      await Organization.findByIdAndUpdate(ctx.userId, {
        $push: { campaigns: campaign.id },
      });

      return campaign;
    },

    updateCampaign: async (_, { id, input }) => {
      return await Campaign.findByIdAndUpdate(id, input, { new: true });
    },
    deleteCampaign: async (_, { id }) => {
      await Campaign.findByIdAndDelete(id);
      return id;
    },

    //Basket
    createBasket: async (_, { input }, ctx) => {
      if (!ctx.userId || ctx.userType !== "organization") {
        throw new Error("Organización no autenticada");
      }

      // Añadir los productos a la canasta
      input.products = input.productIds;

      // Asignar la organización autenticada a la canasta
      input.organization = ctx.userId;

      const basket = new Basket(input);

      await basket.save();

      // Update the organization's baskets array to include the new basket
      await Organization.findByIdAndUpdate(ctx.userId, {
        $push: { baskets: basket.id },
      });

      return basket;
    },

    updateBasket: async (_, { id, input }) => {
      if (input.productIds) {
        input.products = input.productIds;
      }
      return await Basket.findByIdAndUpdate(id, input, { new: true });
    },

    deleteBasket: async (_, { id }) => {
      await Basket.findByIdAndDelete(id);
      return id;
    },

    // Donation
    createDonation: async (_, { input }, ctx) => {
      console.log("Usuario y tipo indefinido", ctx.userId, ctx.userType);
      if (!ctx.userId || ctx.userType !== "donor") {
        throw new Error("Usuario no autenticado");
      }

      // Asigna el ID del donante autenticado a la donación
      input.donor = ctx.userId;

      const product = await Product.findById(input.productId);
      if (!product) {
        throw new Error("Producto no encontrado");
      }

      // Asigna el producto y la organización dueña del producto a la donación
      input.product = product.id;
      input.organization = product.organization;

      const donation = new Donation(input);
      await donation.save();

      // Actualiza la lista de donaciones del donante
      await Donor.findByIdAndUpdate(ctx.userId, {
        $push: { donations: donation.id },
      });

      // Actualiza la lista de donaciones recibidas de la organización
      await Organization.findByIdAndUpdate(product.organization, {
        $push: { donationsReceived: donation.id },
      });

      return donation;
    },

    updateDonation: async (_, { id, input }) => {
      return await Donation.findByIdAndUpdate(id, input, { new: true });
    },
    deleteDonation: async (_, { id }) => {
      await Donation.findByIdAndDelete(id);
      return id;
    },
  },
};
module.exports = resolvers;
