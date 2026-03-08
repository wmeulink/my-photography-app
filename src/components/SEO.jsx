// components/SEO.jsx
import React from "react";
import { Helmet } from "react-helmet-async";

function SEO({
  title,
  description,
  keywords = "",
  url,
  image,
  type = "website",
}) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
    </Helmet>
  );
}

export default SEO;