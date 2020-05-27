const mongoose = require('mongoose');
const slugify = require('slugify');

const geocoder = require('../helpers/Geocoder');

const BootcampSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      unique: true,
      trim: true,
      maxLength: [50, `Name can't be more then 50 characters`],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    slug: String,
    description: {
      type: String,
      required: true,
      maxLength: [500, `Description can't be more then 500 characters`],
    },
    website: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        'Please use a valid URL with HTTP or HTTPS',
      ],
    },
    phone: {
      type: String,
      maxLength: [20, `Phone number can't be longer than 20 characters`],
    },
    email: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    address: {
      type: String,
      required: [true, 'Please add an address'],
    },
    location: {
      //GeoJSON
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: {
        type: [Number],
        index: '2dsphere',
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
    },
    careers: {
      type: [String],
      required: true,
      enum: [
        'Web Development',
        'Mobile Development',
        'UI/UX',
        'Data Science',
        'Business',
        'Other',
      ],
    },
    averageRating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [10, 'Rating must can not be more than 10'],
    },
    averageCost: Number,
    photo: {
      type: String,
      default: 'no-photo.jpg',
    },
    housing: {
      type: Boolean,
      default: false,
    },
    jobAssistance: {
      type: Boolean,
      default: false,
    },
    jobGuarantee: {
      type: Boolean,
      default: false,
    },
    acceptGi: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//create bootcamp slug
BootcampSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });

  next();
});

//Geocode & create location
BootcampSchema.pre('save', async function (next) {
  const location = await geocoder.geocode(this.address);
  const {
    longitude,
    latitude,
    city,
    stateCode,
    streetName,
    zipcode,
    countryCode,
    formattedAddress,
  } = location[0];

  this.location = {
    type: 'Point',
    coordinates: [longitude, latitude],
    formattedAddress,
    street: streetName,
    city,
    state: stateCode,
    zipcode,
    country: countryCode,
  };

  next();
});

//Populate with virtual fields
BootcampSchema.virtual('courses', {
  ref: 'Course',
  localField: '_id',
  foreignField: 'bootcamp',
  justOne: false,
});

//Cascade delete courses when bootcamp is deleted
BootcampSchema.pre('remove', async function (next) {
  await this.model('Course').deleteMany({ bootcamp: this._id });

  next();
});

module.exports = mongoose.model('Bootcamp', BootcampSchema);
