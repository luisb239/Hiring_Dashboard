'use strict'

module.exports = {

    // TODO -> Call in controllers

    success_200: (body) => {
        return {body: body}
    },
    success_201: (message, body) => {
        return {message: message, body: body}
    },
    success_204: () => {
    },
    error_400: (message, url) => {
        return {message: message, url: url}
    },
    error_404: (message, url) => {
        return {message: message, url: url}
    },
    error_500: (message, url) => {
        return {message: message, url: url}
    }
}
