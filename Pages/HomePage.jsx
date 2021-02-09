import React, { useState, useEffect } from 'react';
import { Text, View, ImageBackground, SafeAreaView, ScrollView, LogBox } from 'react-native';
import styles from '../Styles/MyStyle';
import { Input, Button, Divider } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CategoriesJson = [
    {
        name: "Personal",
        notes: [
            {
                header: "Cleaning",
                description: "Clean The house",
                image: "https://d3m9l0v76dty0.cloudfront.net/system/photos/3508144/large/780185ff8adfd6d049539bb387cedd08.jpg"
            },
            {
                header: "Cooking",
                description: "Cook for Dana Pasta with Mushrooms Creame ",
                image: "https://www.acouplecooks.com/wp-content/uploads/2019/03/Mushroom-Pasta-007.jpg"
            },

        ]
    },
    {
        name: "Studies",
        notes: [
            {
                header: "HomeWork",
                description: "React - 4",
                image: "https://reactjs.org/logo-og.png"
            },
        ]
    },
]

export default function HomePage(props) {
    //const [load, setLoad] = useState(false);
    const [categories, setCategories] = useState([]);
    const [newCategory, setnewCategory] = useState(null);
    const [serialNumber, setserialNumber] = useState(0);
    const input = React.createRef();


    //Fix YellowBox Error
    LogBox.ignoreLogs([
        'Non-serializable values were found in the navigation state',
    ]);

    // check if render============================ ================= > sapir
    // useEffect(() => {
    //     console.log("Use Effect called")
    //     load ? setLoad(false) : setLoad(true)
    // }, [categories])

    useEffect(() => {
        readStorage()
    }, []);

    const setStorage = async (newCategories) => {
        try {
            let jsonValue = JSON.stringify(newCategories);

            await AsyncStorage.setItem("Categories", jsonValue);
            //console.log('Data successfully saved');
            //alert('Data successfully saved');
        } catch (e) {
            alert('Failed to save the data to the storage')
        }
    }

    const updateCat = async (newCat) => {
        //console.log("Update Cat")

        var indexOfUpdatecat = -1;
        var newCategories = [];
        categories.map(category => {
            category.name != newCat.name ?
                newCategories.push(category)
                : newCategories.push(newCat)
            //indexOfUpdatecat = category.serialNumber
        });
        // newCat.serialNumber =indexOfUpdatecat;
        // newCategories[indexOfUpdatecat] = newCat;

        // var newCategories = categories.filter(category => category.name != newCat.name);
        // newCategories = [...newCategories,newCat]
        setCategories(newCategories);
        setStorage(newCategories);

        // Replace old cat with newCat (by category name)
        // use setCategories to update the categories.
        // use setstorage with new categories
    }

    const clearStorage = async () => {
        try {
            setserialNumber(0);
            await AsyncStorage.clear()
            alert('Storage successfully cleared!')
            setCategories([]);
        } catch (e) {
            alert('Failed to clear the async storage.')
        }
    }

    const readStorage = async () => {
        try {
            let res = await AsyncStorage.getItem('Categories')
            if (res !== null) {
                //console.log(res);
                setCategories(JSON.parse(res));
                //alert("The data was read")
            }
        } catch (e) {
            return () => console.log('get error!');
        }
    }

    btnGo2Category = (category) => {
        props.navigation.navigate('NotesCategory', { category, updateCat });
    }

    btnAddCategory = async () => {
        let flag = true;
        categories.forEach(category => {
            if (category.name == newCategory) {
                flag = false;
            }
        })
        if (flag && newCategory !== null) {
            var newCategories = [...categories, { serialNumber, name: newCategory, notes: [] }]; //=====================why? is the same row
            setCategories((prev) => [...prev, { serialNumber, name: newCategory, notes: [] }]); //why? is the same row
            setStorage(newCategories);
            alert("New Category was added")
            //console.log(newCategories);
            setserialNumber(serialNumber + 1);
        }
        else if(newCategory === null){alert("Please insert Category name")}
        else {alert("your Category has already exist")}

        //clear value of textfileds
        input.current.clear();
       
    }

    const inputNewCategoryName = (newName) => {
        setnewCategory(newName);
    }

    let categoriesButtons = categories.map((category, key) => {
        return <Button title={category.name + "---------" + category.notes.length}
            onPress={() => btnGo2Category(category)} key={key} />
    });

    return (
        <ImageBackground source={require('../assets/wallpaper.png')} style={styles.imgBG}>
            <View style={styles.header}>
                <Text style={styles.appHeader} >My Notes</Text>
                <Button title="Clear" style={styles.btClearHomeScreen} onPress={() => clearStorage()} />
            </View>
            <Divider style={{ backgroundColor: 'black', height: 1 }} />
            <View style={styles.body}>
                <Input ref={input} placeholder='Add new category' onChangeText={inputNewCategoryName} />
                <Button title="Add" style={styles.btnAddCategory} onPress={() => btnAddCategory()} />
            </View>
            <SafeAreaView style={styles.container}>
                <ScrollView stickyHeaderIndices={[0]} showsVerticalScrollIndicator={false} style={styles.scrollView}>
                    <View style={styles.footer}>
                        {categoriesButtons}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </ImageBackground>
    )
}