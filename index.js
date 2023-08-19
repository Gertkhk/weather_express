const express = require('express')
const app = express()
const path = require('path')
const fetch = require('node-fetch')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

const key= '559b01018d1357db4e2132b83d795dd9'

app.use(express.json())
app.use(express.urlencoded({extended:true}))

const getWeatherDataPromise = (url) => {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response =>{
                return response.json()
            })
            .then(data =>{
                let description = data.weather[0].description
                let city = data.name
                let temp = Math.round(parseFloat(data.main.temp)-273.15)
                let result = {
                    description: description,
                    city:city,
                    temp:temp
                }
                resolve(result)
            })
            .catch(error => {
                reject(error)
            })
    })
}

app.all('/', (req,res) => {
    let city
    if(req.method == 'GET'){
        city = 'Tartu'
    }
    if(req.method == 'POST'){
        city = req.body.cityname
    }
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`
    getWeatherDataPromise(url)
        .then(data => {
            res.render('index', data)
        })
})

app.get('/', (req,res) => {
    let city = 'Tartu'
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`
    getWeatherDataPromise(url)
        .then(data=>{
            res.render('index', data)
        })
})

app.post('/', (req,res) => {
    let city = req.body.cityname
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`
    getWeatherDataPromise(url)
        .then((data)=>{
            res.render('index', data)
        })
})


// app.post('/', (req, res) => {
//     let city = req.body.cityname
//     fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`)
//     .then((response) => {
//         return response.json()
//     })
//     .then((data) => {
//         let description = data.weather[0].description
//         let city = data.name
//         let temp = Math.round(parseFloat(data.main.temp)-273.15)
//         res.render('index', {
//             description: description,
//             city: city,
//             temp: temp
//         })
//     })
// })


app.listen(3000, ()=> {
    console.log('Server has been started! http://localhost:3000')
});