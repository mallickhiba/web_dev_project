import React from "react";
import Header from "../../common/Header";
import CommonHeading from "../../common/CommonHeading";
import Footer from "../../common/Footer";
import ServiceCard from "./ServiceCard"; // assuming you have a ServiceCard component

const Services1 = ({ services, loading, error }) => {
  return (
    <div>
      <Header />
      <CommonHeading
        heading="Our Services"
        title="Services"
        subtitle="Explore Our"
      />
      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-4">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>{error}</p>
            ) : services.length > 0 ? (
              services.map((service) => (
                <div className="col-md-4" key={service._id}>
                  <ServiceCard service={service} />
                </div>
              ))
            ) : (
              <p>No services available.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Services1;
