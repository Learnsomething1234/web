const Listing = require("../models/listing");
const axios = require("axios");
module.exports.index = async(req, res) => {
    const allListing = await Listing.find({});
    res.render("\listing/index.ejs", { allListing });
};
module.exports.renderNewForm = (req, res) => {
    res.render("\listing/new.ejs")
};
module.exports.showListing = async(req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" }, }).populate("owner");
    if (!listing) {
        req.flash("failure", "listing u requested dies not exit");
        res.redirect("/listing");
    }
    res.render("\listing/show.ejs", { listing });
};
module.exports.createListing = async(req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newlisting = new Listing(req.body.listing);
    let place = newlisting.location;
    console.log(place);
    let geoData = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${place}`);
    let data = await geoData.json();



    let lat = data[0].lat;
    let lon = data[0].lon;
    console.log(data);
    newlisting.data = data[0];
    newlisting.owner = req.user._id;
    newlisting.image = { url, filename };
    console.log(newlisting.image)
    await newlisting.save();
    req.flash("success", "new listing created");
    res.redirect("/listing");


}
module.exports.renderEditForm = async(req, res) => {


    let { id } = req.params;

    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("failure", "listing u requested dies not exit");
        return res.redirect("/listing");
    }

    res.render("\listing/edit.ejs", { listing });
}
module.exports.updateListring = async(req, res) => {
    let { id } = req.params;


    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing });
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let file = req.file.filename;
        listing.image = { url, file };
        await listing.save();
    }


    req.flash("success", "listing updated");
    res.redirect(`/listing/${id}`);
}
module.exports.destroyListing = async(req, res) => {
    let { id } = req.params;

    await Listing.findByIdAndDelete(id);
    req.flash("success", "listing deleted");
    res.redirect("/listing");

}