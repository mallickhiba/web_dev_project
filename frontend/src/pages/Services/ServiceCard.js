import React from 'react';
import { Link } from 'react-router-dom';

const ServiceCard = ({ service, onAddToFavorites, onBookVenue }) => {
  return (
    <Link to={`/service/${service._id}`} className="col-lg-12 wow fadeInUp" data-wow-delay="0.1s">
      <div className="room-item shadow rounded overflow-hidden">
        <div className="position-relative">
          {/* Add any image or additional content here */}
        </div>
        <div className="p-4 mt-2">
          <div className="d-flex justify-content-between mb-3">
            <h5 className="mb-0">{service.service_name}</h5>
            <div className="ps-2">{service.average_rating}</div>
          </div>
          <h6 className="mb-0">{service.area}</h6>
          <h6 className="mb-0">Start price: {service.start_price}</h6>
          <p className="text-body mb-3">{service.description}</p>
          <div className="d-flex justify-content-between">
            <button
              className="btn btn-sm btn-primary rounded py-2 px-4"
              onClick={() => onAddToFavorites(service._id)}
            >
              Add to Favorites
            </button>
            <button
              className="btn btn-sm btn-dark rounded py-2 px-4"
              onClick={() => onBookVenue(service._id)}
            >
              Book Service
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;