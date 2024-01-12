import { useState, useEffect } from 'react'
import Image from '../images/img.jpg'
import axios from 'axios'
import Recipe from '../Recipe';
import { useSelector} from "react-redux/es/hooks/useSelector"
import { useDispatch } from 'react-redux';
import { useNavigate ,useLocation} from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useFieldArray, useForm } from "react-hook-form"
import * as yup from "yup"
//import 'semantic-ui-css/semantic.min.css'
import { FormField, Form } from 'semantic-ui-react'
import AddCategory from './AddCategory';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Del } from '../service/shopping';
import { deleteRecipe, getRecipes } from '../service/recipes';


export default ({byUser}) => {
    //const [Categories, setCategories] = useState([]);
    //const [recipes, setRecipes] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedDuration, setSelectedDuration] = useState(null);
    const [selectedDifficulty, setSelectedDifficulty] = useState(null);
    const [IfbyUser, setIfByUser] = useState(byUser ? true : false);
    const [myRecipes, setMyRecipes] = useState([]);
    const { user, recipes ,Categories} = useSelector(state => ({
        user: state.user.user,
        recipes: state.recipe.recipes,
        Categories:state.category.categories
    }));
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {state} =useLocation();
    const NeedSetCats=state;
    

    
    useEffect(() => {
        dispatch(getRecipes(byUser,user));
    }, [])
   
    
    const handleCategoryChange = (event) => {
        // הפעולה הזו תתבצע כאשר משתמש בוחר אפשרות בתיבת הבחירה
        const selectedCategoryId = event.target.value;
        setSelectedCategory(selectedCategoryId);
        // ניתן להוסיף פעולות נוספות כאן לפי הצורך
    };
    const handleDurationChange = (event) => {
        const selectedDuration = event.target.value;
        setSelectedDuration(selectedDuration);
    };
    function checkDuration(recipe_duration) {
        switch (selectedDuration) {
            case "60":
                return (recipe_duration >= 60);
            case "45":
                return (recipe_duration >= 45 && recipe_duration < 60);
            case "30":
                return (recipe_duration >= 30 && recipe_duration < 45);
            case "15":
                return (recipe_duration >= 0 && recipe_duration < 30);
            default: return false;
        }
    }
    const handleDifficultyChange = (event) => {
        const selectedDifficulty = event.target.value;
        setSelectedDifficulty(selectedDifficulty);
    };
   
    return (<>

        <img src={Image} style={{ width: 500 }}></img>
        <hr />

        <Button variant="outlined"  onClick={()=>( navigate('/recipe/add'),{state:null})}>
        Add Recipe 
        </Button>
        {/* <button onClick={() => ( navigate('/recipe/add'),{state:null})}>AddRecipe</button> */}
        <hr />
      
        <select onChange={handleCategoryChange} value={selectedCategory || ''}>
            {Categories.map((x) =>
                <option key={x.Id} value={x.Id} >{x.Name}</option>)}
        </select>
        <AddCategory/>
        <br/>
        <p>Selected Category: {selectedCategory}</p>
        <select onChange={handleDurationChange} value={selectedDuration || ''}>
            <option value={15} >15 minutes</option>
            <option value={30} >30 minutes</option>
            <option value={45} >45 minutes</option>
            <option value={60} >an hour and more</option>
        </select>
        <p>Selected Duration: {selectedDuration}</p>

        <select onChange={handleDifficultyChange} value={selectedDifficulty || ''}>
            <option value={1} >קל</option>
            <option value={2} >בינוני</option>
            <option value={3} >קשה</option>
            <option value={4} >קשה מאד</option>
        </select>
        <p>Selected Difficulty: {selectedDifficulty}</p>

       
        {recipes?.map(x => (!selectedCategory || x.CategoryId == selectedCategory) && (!selectedDuration || checkDuration(x.Duration)) && (!selectedDifficulty || selectedDifficulty == x.Difficulty) ?
            <div key={x.Id}>
                <Recipe props={x} />
                <div>{x.UserId==user.Id?
                    <div>
                    <button onClick={()=>{ {dispatch(deleteRecipe(user,x))} }}>delete</button>
                    <button onClick={() => ( 
                    navigate('/recipe/edit',{state: x })
                    // <AddRecipe/>
                    )}>Edit</button>
                    </div>:
                    <div>
                        <button onClick={()=>{ {dispatch(deleteRecipe(user,x))} }}disabled={true}>delete</button>
                        <button onClick={() => ( 
                        navigate('/recipe/edit',{state: x })
                        // <AddRecipe/>
                        )}disabled={true}>Edit</button></div>
                        }</div>
            </div>
            : null)}

        {/* {myRecipes.map(x => (!selectedCategory || x.CategoryId == selectedCategory) ?
            <div key={x.Id}>
                <Recipe props={x} />
            </div>
            : null)} */}
    </>);
}
