const initialState = {
    allVideogames: [],
    videogames: [],
    details: [],
    wishList: [],
    genres: [],
    esrb: [],
    cart: [],
}

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case "GET_ALL_VIDEOGAMES":
            return {
                ...state,
                videogames: action.payload,
                allVideogames: action.payload
            }

        case "GET_FILTERED_VIDEOGAMES":
            return {
                ...state,
                videogames: action.payload
            }

        case "GET_CARD_STATISTICS": 
            return {
                ...state,
                videogames: action.payload
            }
            
        case "GET_GENRES":
            return {
                ...state,
                genres: action.payload
            }

        case "GET_ESRB":
            return {
                ...state,
                esrb: action.payload
            }

        case "GET_DETAILS_VIDEOGAME":
            return {
                ...state,
                details: action.payload
            }

        case "DELETE_VIDEOGAME":
            return {
                ...state
            }

        case "PUT_VIDEOGAME":
            return {
                ...state
            }

        case "POST_VIDEOGAME":
            return {
                ...state
            }

        case "ADD_WISH_LIST":
            return {
                ...state,
                wishList: state.wishList.concat(action.payload)
            }
            
        case "DELETE_WISH_LIST":
            return {
                ...state,
                wishList: state.wishList.filter(v => v.id.toString() !== action.payload)
            }

        case "ADD_TO_CART":
            return {
                ...state,
                cart: [...state.cart, action.payload]
            }

        case "REMOVE_FROM_CART":
            return {
                ...state,
                cart: state.cart.filter(game => game.id !== action.payload)
            }

        case "CLEAR_CART":
            return{
                ...state,
                cart: []
            }
    
        default:
            return state;
    }
}

export default rootReducer;