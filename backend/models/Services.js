const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema({
  package_id: { type: Number },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true }
});
//added
const baseOptions = {
	discriminatorKey: "type",
  	collection: "Service",
};
const ServiceSchema = new mongoose.Schema(
  {
   
    vendor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    packages: [PackageSchema],
    service_name: {
      type: String,
      required: true
    },
    service_category: {
      type: String,
      enum: ['decor', 'venue', 'catering', 'photography'],
      required: true
    },
    cancellation_policy: {
      type: String,
      enum: ['Flexible', 'Moderate', 'Strict'],
      required: true
    },
    staff: {
      type: String,
      enum: ['Male', 'Female'],
      required: true
    },
    description: {
      type: String,
      required: true
    },
    start_price: {
      type: Number,
      required: true
    },
    average_rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    latitude: {
      type: Number
    },
    longitude: {
      type: Number
    },
    city: {
      type: String,
      enum: ['Karachi', 'Lahore', 'Islamabad'],
      default: 'Karachi'
    },
    area:{
      type: String,
      enum: ['Saddar','Gulshan-e-Iqbal', 'DHA', "North Nazimabad", "Other"]
  },

  }, 
  baseOptions
 );
 const BaseService = mongoose.model('Service', ServiceSchema);

 const CateringService = BaseService.discriminator('CateringService', new mongoose.Schema({ 
	cuisine: { type: String, required: true }
	})
);

const VenueService = BaseService.discriminator('VenueService', new mongoose.Schema({ 
	capacity : { type: Number, required: true },
	outdoor  : { type: String,enum: ['outdoor', 'banquet'], required: true }
	})
);

const PhotographyService = BaseService.discriminator('PhotographyService', new mongoose.Schema({ 
	drone   : { type: Boolean, required: true },
	})
);

const DecorService = BaseService.discriminator('DecorService', new mongoose.Schema({ 
	decortype: { 
		type: [{
			type: String,
			enum: ['wedding', 'birthday party', 'anniversary', 'formal events'],
		}],
		required: true,
		validate: {
			validator: function(arr) {
				return arr.length >= 1 && arr.length <= 4;
			},
			message: 'Select at least one and up to four decor types.'
		}
	},
}));




//done added




ServiceSchema.pre('save', async function(next) {
  try {
    const service = this;
    // Check if the 'packages' field is modified or not
    if (service.isModified('packages')) {
      // Calculate the package_id for each package in the array
      service.packages.forEach((pkg, index) => {
        // Set the package_id to the next number
        pkg.package_id = index + 1;
      });
    }
    next();
  } catch (error) {
    next(error);
  }
});
const Service = mongoose.model('Service', ServiceSchema);

module.exports = Service;