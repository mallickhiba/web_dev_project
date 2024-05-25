import React from 'react';

const VenueCard = ({ venue, onAddToFavorites, onBookVenue }) => {
  return (
    <div className="col-lg-12 wow fadeInUp" data-wow-delay="0.1s">
      <div className="room-item shadow rounded overflow-hidden">
        <div className="position-relative">
          <small className="position-absolute start-0 top-100 translate-middle-y bg-primary text-white rounded py-1 px-3 ms-4">
            {venue.price}
          </small>
        </div>
        <div className="p-4 mt-2">
          <div className="d-flex justify-content-between mb-3">
            <h5 className="mb-0">{venue.service_name}</h5>
            <div className="ps-2">{venue.average_rating}</div>
          </div>
          <h6 className="mb-0">{venue.area}</h6>
          <h6 className="mb-0">Start price: {venue.start_price}</h6>
          <p className="text-body mb-3">{venue.description}</p>
          <div className="d-flex justify-content-between">
            <button
              className="btn btn-sm btn-primary rounded py-2 px-4"
              onClick={() => onAddToFavorites(venue.id)}
            >
              Add to Favorites
            </button>
            <button
              className="btn btn-sm btn-dark rounded py-2 px-4"
              onClick={() => onBookVenue(venue.id)}
            >
              Book Venue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueCard;
