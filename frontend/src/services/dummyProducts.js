const DUMMY_PRODUCTS_API = "https://dummyjson.com/products";

export const normalizeDummyProduct = (product) => ({
  ...product,
  _id: String(product.id),
});

export const fallbackProducts = [];

export const fetchDummyProducts = async () => {
  try {
    const response = await fetch(DUMMY_PRODUCTS_API);
    if (!response.ok) {
      return fallbackProducts;
    }

    const data = await response.json();
    return Array.isArray(data.products)
      ? data.products.map(normalizeDummyProduct)
      : fallbackProducts;
  } catch (error) {
    console.error(error);
    return fallbackProducts;
  }
};

export const fetchDummyProductById = async (id) => {
  try {
    const response = await fetch(`${DUMMY_PRODUCTS_API}/${id}`);
    if (!response.ok) {
      throw new Error("Unable to load product details from DummyJSON");
    }

    const product = await response.json();
    return normalizeDummyProduct(product);
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const fetchDummyCategories = async () => {
  try {
    const response = await fetch(`${DUMMY_PRODUCTS_API}/categories`);
    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      return [];
    }

    return data
      .map((item) => (typeof item === "string" ? item : item?.slug))
      .filter(Boolean);
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchDummyCategoryProducts = async (category) => {
  try {
    const response = await fetch(`${DUMMY_PRODUCTS_API}/category/${encodeURIComponent(category)}`);
    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return Array.isArray(data.products)
      ? data.products.map(normalizeDummyProduct)
      : [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchDummySearchProducts = async (query) => {
  try {
    const response = await fetch(`${DUMMY_PRODUCTS_API}/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return Array.isArray(data.products)
      ? data.products.map(normalizeDummyProduct)
      : [];
  } catch (error) {
    console.error(error);
    return [];
  }
};
