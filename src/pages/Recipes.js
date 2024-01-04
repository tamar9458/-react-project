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

export default (byUser) => {
    const [Categories, setCategories] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedDuration, setSelectedDuration] = useState(null);
    const [selectedDifficulty, setSelectedDifficulty] = useState(null);
    const [IfbyUser, setIfByUser] = useState(byUser ? true : false);
    const [myRecipes, setMyRecipes] = useState([]);
    const user = useSelector(state => state.user.user)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    //const RecipesFromRedux = useSelector(state => state.recipe.recipes);
    const {state} =useLocation();
    const NeedSetCats=state;
    let NeedSetRec=false;

    useEffect(() => {
        console.log(user);
        console.log("byUser", byUser);
        if (!byUser) {
            axios.get('http://localhost:8080/api/recipe').then((r) => { setRecipes(r.data); })
            console.log(recipes)
        }
        else {
            console.log("true")
            axios.get('http://localhost:8080/api/recipe').then((r) => { setRecipes(r.data.filter((x) => x.UserId == user?.Id)) })
            console.log(recipes)
        }
        axios.get('http://localhost:8080/api/category').then((c) => { setCategories(c.data) })
    }, [])
    useEffect(() => {
        if(NeedSetCats===true){
            axios.get('http://localhost:8080/api/category').then((c) => { setCategories(c.data) })
            console.log("setCats");
        }
        
    }, [Categories])
    // useEffect(() => {
    //     if(NeedSetRec===true){
    //         axios.get('http://localhost:8080/api/recipe').then((r) => { setRecipes(r.data); })
    //         console.log(recipes)
    //     }
        
    // }, [recipes])
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
    const sort = () => {
        console.log("sorting")
        setRecipes(recipes.sort((a, b) => a.Name.localeCompare(b.Name)));
        console.log(recipes)
    }
    
    
    return (<>

        <img src={Image} style={{ width: 500 }}></img>
        <hr />

        <button onClick={() => ( navigate('/recipe/add'),{state:null})}>AddRecipe</button>
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

        <button onClick={sort}>sort by alphbetic order</button>

        {recipes.map(x => (!selectedCategory || x.CategoryId == selectedCategory) && (!selectedDuration || checkDuration(x.Duration)) && (!selectedDifficulty || selectedDifficulty == x.Difficulty) ?
            <div key={x.Id}>
                <Recipe props={x} />
        <button onClick={()=>{ dispatch({type:"DELETE_RECIPE",data:x.Id},); {/*;setRecipes(useSelector(state=>state.recipe.recipes));console.log("dddduseselector",recipes);*/}}}>delete</button>
        <button onClick={() => ( 
            navigate('/recipe/edit',{state: x })
            // <AddRecipe/>
            )}>Edit</button>


            </div>
            : null)}

        {/* {myRecipes.map(x => (!selectedCategory || x.CategoryId == selectedCategory) ?
            <div key={x.Id}>
                <Recipe props={x} />
            </div>
            : null)} */}
    </>);
}
