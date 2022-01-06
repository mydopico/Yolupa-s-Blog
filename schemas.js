const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

module.exports.bookSchema = Joi.object({
    book: Joi.object({
        title: Joi.string().required().escapeHTML(),
        subtitle: Joi.string().required().escapeHTML(),
        image: Joi.string().required().escapeHTML(),
        plot: Joi.string().required().escapeHTML(),
        critique: Joi.string().required().escapeHTML(),
        recommendation: Joi.string().required().escapeHTML(),
        rating: Joi.number().min(1).max(5).required()
    }).required()
});

module.exports.tripSchema = Joi.object({
    trip: Joi.object({
        title: Joi.string().required().escapeHTML(),
        subtitle: Joi.string().required().escapeHTML(),
        image: Joi.string().required(),        
        thanks: Joi.string().required(),        
        location: Joi.string().required().escapeHTML(),
        continent: Joi.string().required().escapeHTML(),		
        // code: Joi.string().required(),		
        // hdi: Joi.number().required()		
    }).required()
});

module.exports.commentSchema = Joi.object({
    comment: Joi.object({
        text: Joi.string().required().escapeHTML()          
    }).required()
});

module.exports.replySchema = Joi.object({
    reply: Joi.object({
        text: Joi.string().required().escapeHTML()          
    }).required()
});

module.exports.tripContentSchema = Joi.object({
    tripContent: Joi.object({
        title: Joi.string().required().escapeHTML(),       
        // image: Joi.string().required(),     
        content: Joi.string().required().escapeHTML()    
    }).required()
});


	