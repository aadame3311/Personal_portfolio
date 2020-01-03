require('dotenv').config();

const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
const Twitter = require('twitter');

// Templating. 
const handlebars = require('express-handlebars');
app.engine('handlebars', handlebars({defaultLayout: 'main'}))
app.set('view engine', 'handlebars');
const path = require('path'); // Path module.

// Serve static files. 
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, './public/vendor')));
app.use(express.static(path.join(__dirname, './public/img/logos/')));
// Get twitter 
var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
})



app.get('/', (req, res) => {
    // Defined basic personal details so I could interploate them into the bio section
    const personal_details = {
        first_name: "Antonio",
        last_name: "Adame Puente",
        title: "Software Engineer",
        address: "2117 Rice Ave",
        city: "McAllen", 
        state: "TX",
        zip: "78504",
        email: "a.adame59@yahoo.com",
    }
    // This object is used in the HTML Handlebars template
    const personal_information = {
        "About": {
            ...personal_details,
            bio: `${personal_details.title} currently based in the ${personal_details.city}, ${personal_details.state} area. `+
                `I personally enjoy working on web and mobile platforms.\n`+
                `Although I'm comfortable learning and using new technologies, I currently focus on Flutter, React.js, Node.js and .NET.`,
            linkedin_profile: "https://www.linkedin.com/in/antonio-adame-757900172/",
            github_profile: "https://www.linkedin.com/in/antonio-adame-757900172/",
            twitter_profile: "https://twitter.com/AntonioAdame3",
            instagram_profile: "https://www.instagram.com/antonioadame.p/",
        },
        "Experience": [
            {
                title: "Software Engineer I",
                company: "Invoice Cloud, Inc.",
                address: "",
                timeline: "01/2020 - Present",
                description: [],
                company_logo: "ic.jpg",
            },
            {
                title: "Web App Developer Intern",
                company: "UTRGV School of Medicine",
                address: "1201 W University Dr. Edinburg, Texas 78541",
                timeline: "06/2019 - 12/2019",
                description: [
                    "Designed and implemented cloud infrastructure for a data warehouse",
                    "Developed base components for faculty dashboard which reports faculty metrics and performance",
                ],
                company_logo: "utrgv_som.png",
            },
            {
                title: "Teaching Assistant",
                company: "UTRGV CECS",
                address: "1201 W University Dr. Edinburg, Texas 78541",
                timeline: "01/2019 - 05/2019",
                description: "Assisted university professors by grading and tutoring students for graduate course Foundations of Algorithms & Programming Languages as well as undergraduate course Computer Science 1. \n"+
                                "Improved student performance by around 12.5% by personally setting up computer science 1 study sessions and meeting times with FAPL graduate students.",
                company_logo: "utrgv.png",
            },
        ],
        "Education": [
            {
                school: "The University of Texas Rio Grande Valley",
                degree: "Bachelor's of Science",
                timeline: "December 2019",
                major: "Computer Science",
                gpa: "GPA: 3.35",
            },

            
        ],
        "Skills": {
            programming_languages: [
                "java", 
                "python", 
                "html5", 
                "css3-alt", 
                "js-square", 
                "react", 
                "node-js", 
                "sass", 
                "npm"
            ],
        },
        "Interests": "Apart from being passionate about software engineering, " +
                    "I enjoy playing music. Like most people, music is a very big part " +
                    "of my life. I primarily play acoustic guitar though I strum on an " +
                    "electric one every so often. If I’m not making music, I’m probably " +
                    "playing video games. Recently, I have been interested in more competitive " +
                    "games such as Rainbow Six and Super Smash Bros \n" +
                    "Aside from video games and music, I also enjoy TV Shows and manga. My " +
                    "favorite TV Series is Game of Thrones and my favorite manga of all time is One Piece.\n",
        "Awards": [
                "1st place - UTRGV Engineering Week Innovation Challenge",
        ],
        "Projects": [
            {
                title: "Preference Assessment Tool",
                description: "Assists in determining preferences of speech disability patients through showcasing different video sequences. Commisioned to a psychology researched at UTRGV. Built using React.js",
                picture: "img/proj1.png",
                link: "http://preference-video0019.herokuapp.com"
            }, 
            {
                title: "ChatBox!",
                description: "Connects clients together through a web socket network. Simple chat application that displays currently connected users. Built using Node JS and Express. Used as a demo for a web development workshop I lead during the first ever HackSTX in McAllen Texas.",
                picture: "img/proj2.png",
                link: "http://chat-box0019.herokuapp.com/"
            }, 

        ]
    }
    // shows the latest tweets from user with name 'screen_name'
    const params = {
        screen_name: 'AntonioAdame3',
        count: 3,
        exclude_replies: true,
    }
    let tweetInfo = {"tweets": []};
    const promise = new Promise(function(resolve, reject){
        client.get('statuses/user_timeline', params, (error, tweets,response)=>{
            if (!error) {
                tweets.map((t,idx)=>{
                    let tmp = {
                        text: t.text,
                        created_at: t.created_at,
                        screen_name: t.user.screen_name,
                        profile_image: t.user.profile_image_url
                    };
                    tweetInfo.tweets.push(tmp);
                });

                resolve();
            }
            else {
                console.log('error');
            }
        })
    });

    promise.then(function(success) {
        res.render('index', ({
            "personal_information": personal_information,
            "tweet_info": tweetInfo,
        }));
    })



})
app.get('/api', (req, res) => {

    res.render('index', {message: "hello world"})
    
})

app.listen(port, () => console.log(`App listening on port ${port}!`))