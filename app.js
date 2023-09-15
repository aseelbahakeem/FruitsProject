const mongoose = require('mongoose');

//Connection to MongoDB database
//⁡⁢⁣⁣This line will specify the port where we will access our MongoDB Server
//⁡⁢⁣⁣Here "fruitsDB" is the name of the database where we want to connect to.⁡
mongoose.connect("mongodb://localhost:27017/fruitsDB", { useNewUrlParser: true });

//Here we create new blueprint of our database(Schema)
//This lays foundation for every new fruit document that will be added to our DB.
const fruitSchema = new mongoose.Schema({
        name: {
                type: String,
                required: [true, "Please check your data entry, no name specifed!"]
        },
        rating: {
                type: Number,
                min: [1, "I know you hate the food but least score is 1, your score is {VALUE}"],
                max: [10, "Seems you are in love with the food, but rules are rules, highest score is 10, your score is {VALUE}"]

        },
        review: String
});

const Fruit = mongoose.model("Fruit", fruitSchema);

const fruit = new Fruit({
        name: "Apple",
        rating: 10,
        review: "Apple keeps the doctor away"
})

//This save() method in Mongoose is used to save this fruit document into fruit collection inside 
//our fruitsDB
//Once a collection is saved comment fruit.save() bcoz everytime it will save same thing 
//multiple times.

const personSchema = new mongoose.Schema({
        name: String,
        age: Number,
        /*This tells Mongoose that we are embedding a fruit document inside this property
         called favoriteFruit in our person document.*/
        favouriteFruit: fruitSchema
});

const Person = mongoose.model("Person", personSchema);

const mango = new Fruit({
        name: "mango",
        rating: 9,
        review: "decent Fruit."
})

//mango.save();

const person = new Person({
        name: "Sara",
        age: 38,
        favouriteFruit: mango


});

const orange = new Fruit({
        name: "Orange",
        rating: 6,
        review: "The Sour Fruit!"
});

const banana = new Fruit({
        name: "Banana",
        rating: 8,
        review: "The Digestive Fruit!"
});

//In latest version of mongoose insertMany has stopped accepting callbacks
//instead they use promises(Which Angela has not taught in this course)
//So ".then" & "catch" are part of PROMISES IN JAVASCRIPT.

//PROMISES in brief(If something is wrong please correct me):
//In JS, programmers encountered a problem called "callback hell", where syntax of callbacks were 
//cumbersome & often lead to more problems.
//So in effort to make it easy PROMISES were invented.
//to learn more about promise visit : https://javascript.info/promise-basics
//Or https://www.youtube.com/watch?v=novBIqZh4Bk


//fruit.save();
person.save();

/*Fruit.insertMany([orange, banana])
        .then(function () {
                console.log("data successfully pushed to the database")
        })
        .catch(function (err) {
                console.log(err);
        });*/


//read from FruitDB database
Fruit.find()
        .then(fruits => {
                fruits.forEach(function (fruit) {
                        console.log(fruit.name);
                        console.log(fruit.rating);
                        console.log(fruit.review);
                });
        })
        .catch(err => {
                console.error(err);
        })
        .finally(() => {
                setTimeout(() => { /**If you warp mongoose.connection.close() in a timeout the error won't happen.
         I think its because the connection is getting closed while the operations are not done yet.
I tried setting it to a lower number and got the same error, but 5 is fine. You may need to set a bigger number
 if you have a lot going on. */
                        mongoose.connection.close();
                }, 5);
        });


/*update database: We are using a Promise to handle the result of the updateOne() method call. 
If the update is successful, the then() method is called and logs a success message to the console. 
If there is an error, the catch() method is called and logs the error message to the console.*/
        function updateData(modelName, id, update) {
                modelName.updateOne({ _id: id }, update)
                  .then(() => {
                    console.log("Successfully Updated");
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }
//Delete Data code is here:
function deleteData(modelName, name, isMany) {
        const query = { name: name };
        if (isMany) {
                modelName.deleteMany(query)
                        .then(() => {
                                console.log(`Successfully Deleted All Data named ${name}`);
                        })
                        .catch((err) => {
                                console.log(err);
                        });
        } else {
                modelName.deleteOne(query)
                        .then(() => {
                                console.log("Successfully Deleted");
                        })
                        .catch((err) => {
                                console.log(err);
                        });
        }
}
deleteData(Fruit, "Apple", false);//false means one
deleteData(Fruit, "Orange", true); //true means many
deleteData(Person, "John", true);


updateData(Fruit, "64a89e08d8569a12623000af", { name: "new fruitsss", rating: 7 });
updateData(Person, "64a8865e9bd9ee423d5d28b6", { name: "Annie"});

