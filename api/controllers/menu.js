import { Menu } from "../../models/Menu.js";

// create menu
export const createMenu = async (req, res, next) => {
  const {
    title,
    slug,
    description,
    price,
    imageUrl,
    durationDays,
    proteins = [],
    nutritionFacts,
    information,
  } = req.body;
  // if (!title || !slug || !price || !category || !kcal) {
  //   const error = new Error("Title, slug, price, category and kcal are required!");
  //   error.status = 400;
  //   return next(error);
  // }
  try {
    const menu = await Menu.findOne({ title });

    if (menu) {
      const error = new Error("Menu title already in use!");
      error.status = 409;
      return next(error);
    }
    const newMenu = await Menu.create({
      title,
      slug,
      description,
      price,
      imageUrl,
      durationDays,
      proteins,
      nutritionFacts,
      information,
    });
    res
      .status(201)
      .json({ error: false, newMenu, message: "Menu created successfully!" });
  } catch (err) {
    next(err);
  }
};

// get all menus
export const getAllMenus = async (req, res, next) => {
  try {
    const menus = await Menu.find().sort({ createdAt: -1 });
    res.status(200).json({
      error: false,
      menus,
      message: "All menus retrieved successfully!",
    });
  } catch (err) {
    next(err);
  }
};

// get menu by id
export const getMenuById = async (req, res, next) => {
  const { menuId } = req.params;

  try {
    const menu = await Menu.findOne({ _id: menuId });

    if (!menu) {
      const error = new Error("Menu not found!");
      error.status = 404;
      return next(error);
    }
    res
      .status(200)
      .json({ error: false, menu, message: "Menu retrieved successfully!" });
  } catch (err) {
    next(err);
  }
};

// get menu by slug
export const getMenuBySlug = async (req, res, next) => {
  const { slug } = req.params;

  try {
    const menu = await Menu.findOne({ slug });

    if (!menu) {
      const error = new Error("Menu not found!");
      error.status = 404;
      return next(error);
    }
    res
      .status(200)
      .json({ error: false, menu, message: "Menu retrieved successfully!" });
  } catch (err) {
    next(err);
  }
};

// edit menu
export const editMenu = async (req, res, next) => {
  const { menuId } = req.params;
  const { title, slug, description, price, imageUrl, category, kcal } =
    req.body;

  try {
    const menu = await Menu.findOne({ _id: menuId });

    if (!menu) {
      const error = new Error("Menu not found!");
      error.status = 404;
      return next(error);
    }

    // Update other fields if provided
    // Check for unique title if it's being updated
    if (title) {
      if (title === menu.title) {
        const error = new Error("Menu title already in use!");
        error.status = 409;
        return next(error);
      }
      menu.title = title;
    }
    if (slug) menu.slug = slug;
    if (description) menu.description = description;
    if (price) menu.price = price;
    if (imageUrl) menu.imageUrl = imageUrl;
    if (category) menu.category = category;
    if (kcal) menu.kcal = kcal;

    await menu.save();
    res.status(200).json({
      error: false,
      menu,
      message: "Menu updated successfully!",
    });
  } catch (err) {
    next(err);
  }
};

// delete menu
export const deleteMenu = async (req, res, next) => {
  const { menuId } = req.params;

  try {
    const menu = await Menu.findOne({ _id: menuId });

    if (!menu) {
      const error = new Error("Menu not found!");
      error.status = 404;
      return next(error);
    }

    await Menu.deleteOne({ _id: menuId });

    res.status(200).json({
      error: false,
      menu,
      message: "Menu deleted successfully!",
    });
  } catch (err) {
    next(err);
  }
};
