import Listing from "../models/listing.js";
import fetch from "node-fetch";

// Index
export const index = async (req, res) => {
  let { category, q } = req.query;
  let allListings;

  if (q) {
    allListings = await Listing.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } },
        { country: { $regex: q, $options: "i" } }
      ]
    });
  } else if (category) {
    allListings = await Listing.find({ category });
  } else {
    allListings = await Listing.find();
  }

  res.render("listings/index.ejs", { allListings, selectedCategory: category });
};

// Render new listing form
export const renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// Show single listing
export const showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: ({ path: "author" }) })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Requested listing not found");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
};

// Create new listing
export const postListing = async (req, res) => {
  const { listing } = req.body;
  const newListing = new Listing(listing);
  newListing.owner = req.user._id;

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${listing.location}&limit=1&email=your-email@example.com`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.length > 0) {
    newListing.geometry = {
      type: "Point",
      coordinates: [parseFloat(data[0].lon), parseFloat(data[0].lat)]
    };
  }

  if (req.file) {
    newListing.image = {
      filename: req.file.filename,
      url: req.file.path
    };
  }

  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

// Render edit form
export const editListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Requested listing not found");
    return res.redirect("/listings");
  }

  res.render("listings/edit.ejs", { listing });
};

// Update listing
export const updateListing = async (req, res) => {
  const { id } = req.params;
  const { listing } = req.body;

  if (!listing || !listing.title || !listing.description || !listing.price || !listing.country || !listing.location) {
    throw new ExpressError(400, "All fields are required and must be valid");
  }

  if (listing.description.trim().length < 20) {
    throw new ExpressError(400, "Description should be at least 20 characters");
  }

  const updatedListing = await Listing.findByIdAndUpdate(id, { ...listing }, { new: true });

  if (listing.location) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${listing.location}&limit=1&email=smile@gmail.com`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.length > 0) {
      updatedListing.geometry = {
        type: "Point",
        coordinates: [parseFloat(data[0].lon), parseFloat(data[0].lat)]
      };
      await updatedListing.save();
    }
  }

  if (req.file) {
    updatedListing.image = {
      filename: req.file.filename,
      url: req.file.path
    };
    await updatedListing.save();
  }

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

// Delete listing
export const destroyLising = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect(`/listings`);
};
