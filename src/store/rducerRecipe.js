import * as Actions from './action'
import axios from 'axios';
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
            console.log("edit: ",action)
            const findIndex = recipes.findIndex(x => x.Id === action.data.Id);
            recipes[findIndex] = action.data;
            return { ...state, recipes }
        }
        case "DELETE_RECIPE": {
            console.log("delete: ",action)
             axios.post(`http://localhost:8080/api/recipe/delete/:${action.data}`)
            .then((res)=>{
                 console.log("afterdel",{...state});
                 const recipes = [...state.recipes];
                 const findIndex = recipes.findIndex(x => x.Id === action.data);
                 recipes.splice(findIndex,1);
            //     console.log("rec af del",{ ...state, recipes });
                 return { ...state, recipes }
            // })
            // .then(()=>{const recipes = state.recipes.filter(x => x.Id !== action.data);
            // state.recipes=recipes;
            // return { ...state, recipes} 
            }).catch((error)=>{console.error(error)})
            
          
        }
        default: return { ...state }
    }
}

// reducer({ type: "ADD", payload: "dvora", data: "lll" })

export default reducer;