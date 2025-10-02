import joi from "joi";

export const listingSchema = joi.object({
    listing: joi.object({
        title: joi.string().required(),
        description: joi.string().min(20).required(),
        image: joi.string().uri().allow("", null),
        price: joi.number().min(499).required(),
        location: joi.string().required(),
        country: joi.string().required(),
         category: joi.string()
            .valid(
                "trending","rooms","cities","mountains","arctic",
                "luxury","beach","lakefront","pools","camping","farm"
            )
            .required()
    }).required()
});

export const reviewSchema = joi.object({
    review: joi.object({
        comment: joi.string()
        .min(5)
        .max(300)
        .required()
        .messages({
        "string.empty": "Comment cannot be empty",
        "string.min": "Comment should have at least 5 characters",
        "string.max": "Comment should not exceed 300 characters"
        }),
        rating: joi.number()
        .min(1)
        .max(5)
        .required()
        .messages({
        "number.base": "Rating must be a number",
        "number.min": "Rating cannot be less than 1",
        "number.max": "Rating cannot be more than 5"
      })
    }).required()
});
