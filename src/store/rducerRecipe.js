import * as Actions from './action'
const initalseState = {
    recipes: []
}

const reducer = (state = initalseState, action) => {
    switch (action.type) {
        case "SET_RECIPE_USER": {
            const recipes = state.recipes.filter(x => x.userId === action.userId);
            return { ...state, recipes }
        }
        case "SET_RECIPE":
            return { ...state, recipes: action.data }
        case "ADD_RECIPE": {
            const recipes = [...state.recipes];
            console.log(recipes)
            recipes.push(action.recipe);
            console.log(action.recipes)
            return { ...state, recipes }
        }
        case "EDIT_RECIPE": {
            const recipes = [...state.recipes];
            const findIndex = recipes.findIndex(x => x.Id === action.data.Id);
            recipes[findIndex] = action.data;
            return { ...state, recipes }
        }
        case "DELETE_RECIPE": {
          
            const recipes = state.recipes.filter(x => x.Id !== action.data.Id);
            return { ...state, recipes }
            
        }
        default: return { ...state }
    }
}

// reducer({ type: "ADD", payload: "dvora", data: "lll" })

export default reducer;