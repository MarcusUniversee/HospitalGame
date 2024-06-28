/*Qualtrics.SurveyEngine.addOnload(function() {
    let Q = this;
	Q.disableNextButton();*/

let mscore = 0; // Initialize score
let sscore = 0;
let timerInterval; // Variable to hold timer interval
let breakTimerInterval; // Variable to hold timer interval for breaks
let jobTimerInterval;
let tasksCompleted = 0;
let mainJobCount = 0;
let telemedicineCount = 0; // Initialize at the top with other variables
let numberSearchCount = 0;
let surpriseVisitCount = 0;
let playerStr = ""
let scored = true
let inDiagnosis = false
let totalSecondsLate = 0 // seconds late getting back to main job from break
let mainJobSecondsLate = 0  // seconds of overtime 
let cumulativeDayStats = []
let playerActions = ""
let breakTimerStatus = ""
let mainJobTimerStatus = ""
let playerActions1 = "", playerActions2 = "", playerActions3 = "", playerActions4 = "", playerActions5 = "", playerActions6 = "", playerActions7 = "", playerActions8 = "", playerActions9 = "";

//use this structure to store the names and symptoms of diagnoses if we want to use them anywhere
const chart = {
    "Cardiac Arrest": [],
    "Stroke": [],
    "Pneumonia": [],
    "Tuberculosis": [],
}


//edit the main configurations of the game
let GameConfig = {
    //first dimension is day, second is shift, value is number of patients
    MainJob: [[4, 4], [3, 4], [5, 5],[4, 6], [5, 7], [4, 4],[7, 7], [4, 6], [6, 6]],
    MainJobTimer: [[60, 60], [45, 60], [50, 50],[50, 50], [45, 50], [35, 30],[50, 50], [45, 50], [50, 60]],
    //same dimensions as main job, first shift should be 0
    Telemedicine: [[0, 0], [0, 0], [0, 0],[0, 5], [0, 15], [0, 10],[0, 5], [0, 20], [0, 10]],
    NumberSearch: [[0, 0], [0, 0], [0, 0],[0, 5], [0, 15], [0, 10],[0, 5], [0, 20], [0, 10]],
    //same length as # of days
    SurpriseVisits: [false, true, false, true, true, false, true, false, true],
    BreakLength: 15,
    DayBreakLength: 20,
}

let patient_json = [
    {
        "": "0",
        "patient #": "0",
        "corr diagnosis": "Stroke",
        "symptoms": [
            "dizziness",
            "trouble walking",
            "numbness in one arm"
        ]
    },
    {
        "": "1",
        "patient #": "1",
        "corr diagnosis": "Tuberculosis",
        "symptoms": [
            "fatigue",
            "coughing blood",
            "cough"
        ]
    },
    {
        "": "2",
        "patient #": "2",
        "corr diagnosis": "Tuberculosis",
        "symptoms": ["This is an attention check question, select Tuberculosis"
        ]
    },
    {
        "": "3",
        "patient #": "3",
        "corr diagnosis": "Tuberculosis",
        "symptoms": [
            "swellings",
            "coughing blood",
            "cough"
        ]
    },
    {
        "": "4",
        "patient #": "4",
        "corr diagnosis": "Cardiac Arrest",
        "symptoms": [
            "fatigue",
            "rapid heart rate",
            "short breath"
        ]
    },
    {
        "": "5",
        "patient #": "5",
        "corr diagnosis": "Tuberculosis",
        "symptoms": [
            "fatigue",
            "cough",
            "swellings"
        ]
    },
    {
        "": "6",
        "patient #": "6",
        "corr diagnosis": "Cardiac Arrest",
        "symptoms": [
            "dizziness",
            "rapid heart rate",
            "fatigue"
        ]
    },
    {
        "": "7",
        "patient #": "7",
        "corr diagnosis": "Stroke",
        "symptoms": [
            "numbness in one arm",
            "trouble walking",
            "trouble speaking"
        ]
    },
    {
        "": "8",
        "patient #": "8",
        "corr diagnosis": "Pneumonia",
        "symptoms": [
            "fever",
            "short breath",
            "cough"
        ]
    },
    {
        "": "9",
        "patient #": "9",
        "corr diagnosis": "Stroke",
        "symptoms": [
            "dizziness",
            "trouble walking",
            "numbness in one arm"
        ]
    },
    {
        "": "10",
        "patient #": "10",
        "corr diagnosis": "Cardiac Arrest",
        "symptoms": [
            "short breath",
            "fatigue",
            "chest pain"
        ]
    },
    {
        "": "11",
        "patient #": "11",
        "corr diagnosis": "Tuberculosis",
        "symptoms": [
            "cough",
            "swellings",
            "fatigue"
        ]
    },
    {
        "": "12",
        "patient #": "12",
        "corr diagnosis": "Tuberculosis",
        "symptoms": [
            "cough",
            "swellings",
            "fever"
        ]
    },
    {
        "": "13",
        "patient #": "13",
        "corr diagnosis": "Cardiac Arrest",
        "symptoms": [
            "fatigue",
            "dizziness",
            "rapid heart rate"
        ]
    },
    {
        "": "14",
        "patient #": "14",
        "corr diagnosis": "Tuberculosis",
        "symptoms": [
            "cough",
            "fever",
            "fatigue"
        ]
    },
    {
        "": "15",
        "patient #": "15",
        "corr diagnosis": "Tuberculosis",
        "symptoms": [
            "fever",
            "coughing blood",
            "swellings"
        ]
    },
    {
        "": "16",
        "patient #": "16",
        "corr diagnosis": "Cardiac Arrest",
        "symptoms": [
            "chest pain",
            "rapid heart rate",
            "short breath"
        ]
    },
    {
        "": "17",
        "patient #": "17",
        "corr diagnosis": "Tuberculosis",
        "symptoms": [
            "coughing blood",
            "cough",
            "swellings"
        ]
    },
    {
        "": "18",
        "patient #": "18",
        "corr diagnosis": "Pneumonia",
        "symptoms": [
            "This is an attention check question, select Pneumonia"
        ]
    },
    {
        "": "19",
        "patient #": "19",
        "corr diagnosis": "Pneumonia",
        "symptoms": [
            "cough",
            "fever",
            "chills"
        ]
    },
    {
        "": "20",
        "patient #": "20",
        "corr diagnosis": "Stroke",
        "symptoms": [
            "dizziness",
            "trouble speaking",
            "numbness in one arm"
        ]
    },
    {
        "": "21",
        "patient #": "21",
        "corr diagnosis": "Cardiac Arrest",
        "symptoms": [
            "dizziness",
            "chest pain",
            "rapid heart rate"
        ]
    },
    {
        "": "22",
        "patient #": "22",
        "corr diagnosis": "Stroke",
        "symptoms": [
            "dizziness",
            "trouble speaking",
            "trouble walking"
        ]
    },
    {
        "": "23",
        "patient #": "23",
        "corr diagnosis": "Pneumonia",
        "symptoms": [
            "muscle ache",
            "cough",
            "short breath"
        ]
    },
    {
        "": "24",
        "patient #": "24",
        "corr diagnosis": "Tuberculosis",
        "symptoms": [
            "swellings",
            "fatigue",
            "cough"
        ]
    },
    {
        "": "25",
        "patient #": "25",
        "corr diagnosis": "Pneumonia",
        "symptoms": [
            "short breath",
            "chills",
            "cough"
        ]
    },
    {
        "": "26",
        "patient #": "26",
        "corr diagnosis": "Tuberculosis",
        "symptoms": [
            "coughing blood",
            "fever",
            "fatigue"
        ]
    },
    {
        "": "27",
        "patient #": "27",
        "corr diagnosis": "Tuberculosis",
        "symptoms": [
            "fatigue",
            "cough",
            "fever"
        ]
    },
    {
        "": "28",
        "patient #": "28",
        "corr diagnosis": "Pneumonia",
        "symptoms": [
            "fever",
            "muscle ache",
            "cough"
        ]
    },
    {
        "": "29",
        "patient #": "29",
        "corr diagnosis": "Stroke",
        "symptoms": [
            "trouble speaking",
            "dizziness",
            "numbness in one arm"
        ]
    },
    {
        "": "30",
        "patient #": "30",
        "corr diagnosis": "Pneumonia",
        "symptoms": [
            "muscle ache",
            "fever",
            "chills"
        ]
    },
    {
        "": "31",
        "patient #": "31",
        "corr diagnosis": "Pneumonia",
        "symptoms": [
            "chills",
            "cough",
            "fever"
        ]
    },
    {
        "": "32",
        "patient #": "32",
        "corr diagnosis": "Pneumonia",
        "symptoms": [
            "cough",
            "short breath",
            "chills"
        ]
    },
    {
        "": "33",
        "patient #": "33",
        "corr diagnosis": "Tuberculosis",
        "symptoms": [
            "fever",
            "swellings",
            "cough"
        ]
    },
    {
        "": "34",
        "patient #": "34",
        "corr diagnosis": "Stroke",
        "symptoms": [
            "numbness in one arm",
            "dizziness",
            "trouble walking"
        ]
    },
    {
        "": "35",
        "patient #": "35",
        "corr diagnosis": "Pneumonia",
        "symptoms": [
            "fever",
            "cough",
            "muscle ache"
        ]
    },
    {
        "": "36",
        "patient #": "36",
        "corr diagnosis": "Cardiac Arrest",
        "symptoms": [
            "fatigue",
            "short breath",
            "chest pain"
        ]
    },
    {
        "": "37",
        "patient #": "37",
        "corr diagnosis": "Cardiac Arrest",
        "symptoms": [
            "rapid heart rate",
            "fatigue",
            "chest pain"
        ]
    },
    {
        "": "38",
        "patient #": "38",
        "corr diagnosis": "Stroke",
        "symptoms": [
            "trouble speaking",
            "numbness in one arm",
            "dizziness"
        ]
    },
    {
        "": "39",
        "patient #": "39",
        "corr diagnosis": "Pneumonia",
        "symptoms": [
            "chills",
            "muscle ache",
            "short breath"
        ]
    },
    {
        "": "40",
        "patient #": "40",
        "corr diagnosis": "Tuberculosis",
        "symptoms": [
            "cough",
            "swellings",
            "coughing blood"
        ]
    },
    {
        "": "41",
        "patient #": "41",
        "corr diagnosis": "Stroke",
        "symptoms": [
            "numbness in one arm",
            "trouble speaking",
            "dizziness"
        ]
    },
    {
        "": "42",
        "patient #": "42",
        "corr diagnosis": "Stroke",
        "symptoms": [
            "This is an attention check question, select Stroke"
        ]
    },
    {
        "": "43",
        "patient #": "43",
        "corr diagnosis": "Stroke",
        "symptoms": [
            "trouble speaking",
            "numbness in one arm",
            "trouble walking"
        ]
    },
    {
        "": "44",
        "patient #": "44",
        "corr diagnosis": "Stroke",
        "symptoms": [
            "trouble walking",
            "dizziness",
            "numbness in one arm"
        ]
    },
    {
        "": "45",
        "patient #": "45",
        "corr diagnosis": "Pneumonia",
        "symptoms": [
            "cough",
            "chills",
            "fever"
        ]
    },
    {
        "": "46",
        "patient #": "46",
        "corr diagnosis": "Pneumonia",
        "symptoms": [
            "fever",
            "chills",
            "muscle ache"
        ]
    },
    {
        "": "47",
        "patient #": "47",
        "corr diagnosis": "Stroke",
        "symptoms": [
            "dizziness",
            "numbness in one arm",
            "trouble walking"
        ]
    },
    {
        "": "48",
        "patient #": "48",
        "corr diagnosis": "Pneumonia",
        "symptoms": [
            "fever",
            "muscle ache",
            "cough"
        ]
    },
    {
        "": "49",
        "patient #": "49",
        "corr diagnosis": "Tuberculosis",
        "symptoms": [
            "coughing blood",
            "fatigue",
            "swellings"
        ]
    },
    {
        "": "50",
        "patient #": "50",
        "corr diagnosis": "Tuberculosis",
        "symptoms": [
            "coughing blood",
            "fever",
            "fatigue"
        ]
    },
    {
        "": "51",
        "patient #": "51",
        "corr diagnosis": "Stroke",
        "symptoms": [
            "dizziness",
            "trouble walking",
            "trouble speaking"
        ]
    },
    {
        "": "52",
        "patient #": "52",
        "corr diagnosis": "Tuberculosis",
        "symptoms": [
            "swellings",
            "cough",
            "fever"
        ]
    },
    {
        "": "53",
        "patient #": "53",
        "corr diagnosis": "Stroke",
        "symptoms": [
            "trouble speaking",
            "dizziness",
            "numbness in one arm"
        ]
    },
    {
        "": "54",
        "patient #": "54",
        "corr diagnosis": "Tuberculosis",
        "symptoms": [
            "swellings",
            "cough",
            "coughing blood"
        ]
    },
    {
        "": "55",
        "patient #": "55",
        "corr diagnosis": "Cardiac Arrest",
        "symptoms": [
            "chest pain",
            "rapid heart rate",
            "fatigue"
        ]
    },
    {
        "": "56",
        "patient #": "56",
        "corr diagnosis": "Stroke",
        "symptoms": [
            "numbness in one arm",
            "dizziness",
            "trouble speaking"
        ]
    },
    {
        "": "57",
        "patient #": "57",
        "corr diagnosis": "Cardiac Arrest",
        "symptoms": [
            "chest pain",
            "fatigue",
            "short breath"
        ]
    },
    {
        "": "58",
        "patient #": "58",
        "corr diagnosis": "Stroke",
        "symptoms": [
            "dizziness",
            "trouble walking",
            "numbness in one arm"
        ]
    },
    {
        "": "59",
        "patient #": "59",
        "corr diagnosis": "Tuberculosis",
        "symptoms": [
            "swellings",
            "cough",
            "fever"
        ]
    },
    {
        "": "60",
        "patient #": "60",
        "corr diagnosis": "Cardiac Arrest",
        "symptoms": [
            "short breath",
            "rapid heart rate",
            "chest pain"
        ]
    },
    {
        "": "61",
        "patient #": "61",
        "corr diagnosis": "Pneumonia",
        "symptoms": [
            "short breath",
            "fever",
            "cough"
        ]
    },
    {
        "": "62",
        "patient #": "62",
        "corr diagnosis": "Stroke",
        "symptoms": [
            "numbness in one arm",
            "dizziness",
            "trouble speaking"
        ]
    },
    {
        "": "63",
        "patient #": "63",
        "corr diagnosis": "Pneumonia",
        "symptoms": [
            "muscle ache",
            "chills",
            "fever"
        ]
    },
    {
        "": "64",
        "patient #": "64",
        "corr diagnosis": "Cardiac Arrest",
        "symptoms": [
            "fatigue",
            "rapid heart rate",
            "chest pain"
        ]
    },
    {
        "": "65",
        "patient #": "65",
        "corr diagnosis": "Cardiac Arrest",
        "symptoms": [
            "This is an attention check question, select Cardiac Arrest"
        ]
    },
    {
        "": "66",
        "patient #": "66",
        "corr diagnosis": "Pneumonia",
        "symptoms": [
            "short breath",
            "cough",
            "fever"
        ]
    },
    {
        "": "67",
        "patient #": "67",
        "corr diagnosis": "Pneumonia",
        "symptoms": [
            "short breath",
            "muscle ache",
            "cough"
        ]
    },
    {
        "": "68",
        "patient #": "68",
        "corr diagnosis": "Cardiac Arrest",
        "symptoms": [
            "rapid heart rate",
            "short breath",
            "dizziness"
        ]
    },
    {
        "": "69",
        "patient #": "69",
        "corr diagnosis": "Stroke",
        "symptoms": [
            "numbness in one arm",
            "dizziness",
            "trouble walking"
        ]
    },
    {
        "": "70",
        "patient #": "70",
        "corr diagnosis": "Cardiac Arrest",
        "symptoms": [
            "fatigue",
            "chest pain",
            "short breath"
        ]
    },
    {
        "": "71",
        "patient #": "71",
        "corr diagnosis": "Cardiac Arrest",
        "symptoms": [
            "dizziness",
            "short breath",
            "chest pain"
        ]
    },
    {
        "": "72",
        "patient #": "72",
        "corr diagnosis": "Tuberculosis",
        "symptoms": [
            "cough",
            "swellings",
            "fever"
        ]
    },
    {
        "": "73",
        "patient #": "73",
        "corr diagnosis": "Cardiac Arrest",
        "symptoms": [
            "rapid heart rate",
            "chest pain",
            "short breath"
        ]
    },
    {
        "": "74",
        "patient #": "74",
        "corr diagnosis": "Stroke",
        "symptoms": [
            "trouble speaking",
            "dizziness",
            "trouble walking"
        ]
    },
    {
        "": "75",
        "patient #": "75",
        "corr diagnosis": "Cardiac Arrest",
        "symptoms": [
            "fatigue",
            "short breath",
            "rapid heart rate"
        ]
    },
    {
        "": "76",
        "patient #": "76",
        "corr diagnosis": "Cardiac Arrest",
        "symptoms": [
            "fatigue",
            "chest pain",
            "rapid heart rate"
        ]
    },
    {
        "": "77",
        "patient #": "77",
        "corr diagnosis": "Cardiac Arrest",
        "symptoms": [
            "short breath",
            "dizziness",
            "fatigue"
        ]
    },
    {
        "": "78",
        "patient #": "78",
        "corr diagnosis": "Pneumonia",
        "symptoms": [
            "chills",
            "short breath",
            "fever"
        ]
    },
    {
        "": "79",
        "patient #": "79",
        "corr diagnosis": "Pneumonia",
        "symptoms": [
            "short breath",
            "muscle ache",
            "cough"
        ]
    },
    {
        "": "80",
        "patient #": "80",
        "corr diagnosis": "Tuberculosis",
        "symptoms": [
            "swellings",
            "fatigue",
            "cough"
        ]
    },
    {
        "": "81",
        "patient #": "81",
        "corr diagnosis": "Stroke",
        "symptoms": [
            "trouble walking",
            "dizziness",
            "numbness in one arm"
        ]
    },
    {
        "": "82",
        "patient #": "82",
        "corr diagnosis": "Stroke",
        "symptoms": [
            "dizziness",
            "numbness in one arm",
            "trouble speaking"
        ]
    },
    {
        "": "83",
        "patient #": "83",
        "corr diagnosis": "Pneumonia",
        "symptoms": [
            "muscle ache",
            "fever",
            "short breath"
        ]
    },
    {
        "": "84",
        "patient #": "84",
        "corr diagnosis": "Stroke",
        "symptoms": [
            "dizziness",
            "trouble walking",
            "numbness in one arm"
        ]
    },
    {
        "": "85",
        "patient #": "85",
        "corr diagnosis": "Tuberculosis",
        "symptoms": [
            "swellings",
            "fatigue",
            "coughing blood"
        ]
    },
    {
        "": "86",
        "patient #": "86",
        "corr diagnosis": "Cardiac Arrest",
        "symptoms": [
            "fatigue",
            "short breath",
            "chest pain"
        ]
    },
    {
        "": "87",
        "patient #": "87",
        "corr diagnosis": "Cardiac Arrest",
        "symptoms": [
            "short breath",
            "fatigue",
            "dizziness"
        ]
    },
    {
        "": "88",
        "patient #": "88",
        "corr diagnosis": "Tuberculosis",
        "symptoms": [
            "fever",
            "fatigue",
            "cough"
        ]
    },
    {
        "": "89",
        "patient #": "89",
        "corr diagnosis": "Pneumonia",
        "symptoms": [
            "cough",
            "chills",
            "short breath"
        ]
    },
    {
        "": "90",
        "patient #": "90",
        "corr diagnosis": "Pneumonia",
        "symptoms": [
            "muscle ache",
            "short breath",
            "chills"
        ]
    },
    {
        "": "91",
        "patient #": "91",
        "corr diagnosis": "Cardiac Arrest",
        "symptoms": [
            "short breath",
            "dizziness",
            "rapid heart rate"
        ]
    },
    {
        "": "92",
        "patient #": "92",
        "corr diagnosis": "Tuberculosis",
        "symptoms": [
            "cough",
            "swellings",
            "coughing blood"
        ]
    },
    {
        "": "93",
        "patient #": "93",
        "corr diagnosis": "Cardiac Arrest",
        "symptoms": [
            "short breath",
            "dizziness",
            "rapid heart rate"
        ]
    },
    {
        "": "94",
        "patient #": "94",
        "corr diagnosis": "Cardiac Arrest",
        "symptoms": [
            "fatigue",
            "chest pain",
            "dizziness"
        ]
    },
    {
        "": "95",
        "patient #": "95",
        "corr diagnosis": "Stroke",
        "symptoms": [
            "dizziness",
            "trouble speaking",
            "numbness in one arm"
        ]
    },
    {
        "": "96",
        "patient #": "96",
        "corr diagnosis": "Pneumonia",
        "symptoms": [
            "fever",
            "cough",
            "short breath"
        ]
    },
    {
        "": "97",
        "patient #": "97",
        "corr diagnosis": "Cardiac Arrest",
        "symptoms": [
            "fatigue",
            "dizziness",
            "rapid heart rate"
        ]
    },
    {
        "": "98",
        "patient #": "98",
        "corr diagnosis": "Pneumonia",
        "symptoms": [
            "cough",
            "fever",
            "muscle ache"
        ]
    },
    {
        "": "99",
        "patient #": "99",
        "corr diagnosis": "Cardiac Arrest",
        "symptoms": [
            "rapid heart rate",
            "short breath",
            "fatigue"
        ]
    }
]

let patient_json_t = [
    {
        "": "0",
        "patient #": "0",
        "corr diagnosis": "Stroke",
        "symptoms": [
            "trouble speaking",
            "dizziness",
            "trouble walking"
        ]
    },
    {
        "": "1",
        "patient #": "1",
        "corr diagnosis": "Pneumonia",
        "symptoms": [
            "short breath",
            "chills",
            "muscle ache"
        ]
    },
    {
        "": "2",
        "patient #": "2",
        "corr diagnosis": "Stroke",
        "symptoms": [
            "dizziness",
            "trouble speaking",
            "numbness in one arm"
        ]
    },
    {
        "": "3",
        "patient #": "3",
        "corr diagnosis": "Tuberculosis",
        "symptoms": [
            "coughing blood",
            "cough",
            "swellings"
        ]
    },
    {
        "": "4",
        "patient #": "4",
        "corr diagnosis": "Tuberculosis",
        "symptoms": [
            "cough",
            "swellings",
            "fatigue"
        ]
    },
    {
        "": "5",
        "patient #": "5",
        "corr diagnosis": "Stroke",
        "symptoms": [
            "This is an attention check question, select Stroke"
        ]
    },
    {
        "": "6",
        "patient #": "6",
        "corr diagnosis": "Cardiac Arrest",
        "symptoms": [
            "fatigue",
            "rapid heart rate",
            "chest pain"
        ]
    },
    {
        "": "7",
        "patient #": "7",
        "corr diagnosis": "Stroke",
        "symptoms": [
            "trouble walking",
            "numbness in one arm",
            "dizziness"
        ]
    },
    {
        "": "8",
        "patient #": "8",
        "corr diagnosis": "Pneumonia",
        "symptoms": [
            "This is an attention check question, select Pneumonia"
        ]
    },
    {
        "": "9",
        "patient #": "9",
        "corr diagnosis": "Cardiac Arrest",
        "symptoms": [
            "rapid heart rate",
            "chest pain",
            "fatigue"
        ]
    },
    {
        "": "10",
        "patient #": "10",
        "corr diagnosis": "Stroke",
        "symptoms": [
            "dizziness",
            "numbness in one arm",
            "trouble speaking"
        ]
    },
    {
        "": "11",
        "patient #": "11",
        "corr diagnosis": "Cardiac Arrest",
        "symptoms": [
            "fatigue",
            "rapid heart rate",
            "chest pain"
        ]
    },
    {
        "": "12",
        "patient #": "12",
        "corr diagnosis": "Stroke",
        "symptoms": [
            "numbness in one arm",
            "dizziness",
            "trouble speaking"
        ]
    },
    {
        "": "13",
        "patient #": "13",
        "corr diagnosis": "Pneumonia",
        "symptoms": [
            "short breath",
            "muscle ache",
            "chills"
        ]
    },
    {
        "": "14",
        "patient #": "14",
        "corr diagnosis": "Pneumonia",
        "symptoms": [
            "muscle ache",
            "short breath",
            "chills"
        ]
    },
    {
        "": "15",
        "patient #": "15",
        "corr diagnosis": "Cardiac Arrest",
        "symptoms": [
            "chest pain",
            "rapid heart rate",
            "fatigue"
        ]
    },
    {
        "": "16",
        "patient #": "16",
        "corr diagnosis": "Pneumonia",
        "symptoms": [
            "muscle ache",
            "short breath",
            "chills"
        ]
    },
    {
        "": "17",
        "patient #": "17",
        "corr diagnosis": "Tuberculosis",
        "symptoms": [
            "swellings",
            "coughing blood",
            "cough"
        ]
    },
    {
        "": "18",
        "patient #": "18",
        "corr diagnosis": "Cardiac Arrest",
        "symptoms": [
            "fatigue",
            "chest pain",
            "rapid heart rate"
        ]
    },
    {
        "": "19",
        "patient #": "19",
        "corr diagnosis": "Stroke",
        "symptoms": [
            "trouble walking",
            "numbness in one arm",
            "dizziness"
        ]
    },
    {
        "": "20",
        "patient #": "20",
        "corr diagnosis": "Pneumonia",
        "symptoms": [
            "chills",
            "muscle ache",
            "short breath"
        ]
    },
    {
        "": "21",
        "patient #": "21",
        "corr diagnosis": "Tuberculosis",
        "symptoms": [
            "swellings",
            "cough",
            "coughing blood"
        ]
    },
    {
        "": "22",
        "patient #": "22",
        "corr diagnosis": "Pneumonia",
        "symptoms": [
            "short breath",
            "muscle ache",
            "chills"
        ]
    },
    {
        "": "23",
        "patient #": "23",
        "corr diagnosis": "Tuberculosis",
        "symptoms": [
            "cough",
            "fatigue",
            "swellings"
        ]
    },
    {
        "": "24",
        "patient #": "24",
        "corr diagnosis": "Stroke",
        "symptoms": [
            "dizziness",
            "trouble walking",
            "trouble speaking"
        ]
    },
    {
        "": "25",
        "patient #": "25",
        "corr diagnosis": "Cardiac Arrest",
        "symptoms": [
            "chest pain",
            "fatigue",
            "rapid heart rate"
        ]
    },
    {
        "": "26",
        "patient #": "26",
        "corr diagnosis": "Stroke",
        "symptoms": [
            "trouble speaking",
            "dizziness",
            "trouble walking"
        ]
    },
    {
        "": "27",
        "patient #": "27",
        "corr diagnosis": "Tuberculosis",
        "symptoms": [
            "fatigue",
            "cough",
            "swellings"
        ]
    },
    {
        "": "28",
        "patient #": "28",
        "corr diagnosis": "Stroke",
        "symptoms": [
            "numbness in one arm",
            "trouble walking",
            "trouble speaking"
        ]
    },
    {
        "": "29",
        "patient #": "29",
        "corr diagnosis": "Tuberculosis",
        "symptoms": [
            "coughing blood",
            "cough",
            "swellings"
        ]
    },
    {
        "": "30",
        "patient #": "30",
        "corr diagnosis": "Stroke",
        "symptoms": [
            "trouble speaking",
            "numbness in one arm",
            "trouble walking"
        ]
    },
    {
        "": "31",
        "patient #": "31",
        "corr diagnosis": "Tuberculosis",
        "symptoms": [
            "cough",
            "coughing blood",
            "swellings"
        ]
    },
    {
        "": "32",
        "patient #": "32",
        "corr diagnosis": "Tuberculosis",
        "symptoms": [
            "swellings",
            "cough",
            "coughing blood"
        ]
    },
    {
        "": "33",
        "patient #": "33",
        "corr diagnosis": "Tuberculosis",
        "symptoms": [
            "swellings",
            "fatigue",
            "cough"
        ]
    },
    {
        "": "34",
        "patient #": "34",
        "corr diagnosis": "Pneumonia",
        "symptoms": [
            "muscle ache",
            "chills",
            "short breath"
        ]
    },
    {
        "": "35",
        "patient #": "35",
        "corr diagnosis": "Cardiac Arrest",
        "symptoms": [
            "This is an attention check question, select Cardiac Arrest"
        ]
    },
    {
        "": "36",
        "patient #": "36",
        "corr diagnosis": "Tuberculosis",
        "symptoms": [
            "fatigue",
            "swellings",
            "cough"
        ]
    },
    {
        "": "37",
        "patient #": "37",
        "corr diagnosis": "Cardiac Arrest",
        "symptoms": [
            "rapid heart rate",
            "fatigue",
            "chest pain"
        ]
    },
    {
        "": "38",
        "patient #": "38",
        "corr diagnosis": "Tuberculosis",
        "symptoms": [
            "cough",
            "coughing blood",
            "swellings"
        ]
    },
    {
        "": "39",
        "patient #": "39",
        "corr diagnosis": "Stroke",
        "symptoms": [
            "dizziness",
            "trouble walking",
            "numbness in one arm"
        ]
    },
    {
        "": "40",
        "patient #": "40",
        "corr diagnosis": "Pneumonia",
        "symptoms": [
            "chills",
            "muscle ache",
            "short breath"
        ]
    },
    {
        "": "41",
        "patient #": "41",
        "corr diagnosis": "Cardiac Arrest",
        "symptoms": [
            "chest pain",
            "fatigue",
            "rapid heart rate"
        ]
    },
    {
        "": "42",
        "patient #": "42",
        "corr diagnosis": "Cardiac Arrest",
        "symptoms": [
            "chest pain",
            "rapid heart rate",
            "fatigue"
        ]
    },
    {
        "": "43",
        "patient #": "43",
        "corr diagnosis": "Tuberculosis",
        "symptoms": [
            "cough",
            "fatigue",
            "coughing blood"
        ]
    },
    {
        "": "44",
        "patient #": "44",
        "corr diagnosis": "Tuberculosis",
        "symptoms": [
            "cough",
            "coughing blood",
            "fatigue"
        ]
    },
    {
        "": "45",
        "patient #": "45",
        "corr diagnosis": "Pneumonia",
        "symptoms": [
            "chills",
            "short breath",
            "muscle ache"
        ]
    },
    {
        "": "46",
        "patient #": "46",
        "corr diagnosis": "Tuberculosis",
        "symptoms": [
            "fatigue",
            "swellings",
            "coughing blood"
        ]
    },
    {
        "": "47",
        "patient #": "47",
        "corr diagnosis": "Stroke",
        "symptoms": [
            "numbness in one arm",
            "trouble speaking",
            "trouble walking"
        ]
    },
    {
        "": "48",
        "patient #": "48",
        "corr diagnosis": "Pneumonia",
        "symptoms": [
            "chills",
            "muscle ache",
            "short breath"
        ]
    },
    {
        "": "49",
        "patient #": "49",
        "corr diagnosis": "Pneumonia",
        "symptoms": [
            "muscle ache",
            "chills",
            "short breath"
        ]
    },
    {
        "": "50",
        "patient #": "50",
        "corr diagnosis": "Cardiac Arrest",
        "symptoms": [
            "chest pain",
            "rapid heart rate",
            "fatigue"
        ]
    },
    {
        "": "51",
        "patient #": "51",
        "corr diagnosis": "Cardiac Arrest",
        "symptoms": [
            "fatigue",
            "chest pain",
            "rapid heart rate"
        ]
    },
    {
        "": "52",
        "patient #": "52",
        "corr diagnosis": "Cardiac Arrest",
        "symptoms": [
            "chest pain",
            "rapid heart rate",
            "fatigue"
        ]
    },
    {
        "": "53",
        "patient #": "53",
        "corr diagnosis": "Pneumonia",
        "symptoms": [
            "muscle ache",
            "short breath",
            "chills"
        ]
    },
    {
        "": "54",
        "patient #": "54",
        "corr diagnosis": "Stroke",
        "symptoms": [
            "dizziness",
            "trouble speaking",
            "numbness in one arm"
        ]
    },
    {
        "": "55",
        "patient #": "55",
        "corr diagnosis": "Pneumonia",
        "symptoms": [
            "short breath",
            "chills",
            "muscle ache"
        ]
    },
    {
        "": "56",
        "patient #": "56",
        "corr diagnosis": "Cardiac Arrest",
        "symptoms": [
            "fatigue",
            "rapid heart rate",
            "chest pain"
        ]
    },
    {
        "": "57",
        "patient #": "57",
        "corr diagnosis": "Pneumonia",
        "symptoms": [
            "muscle ache",
            "chills",
            "short breath"
        ]
    },
    {
        "": "58",
        "patient #": "58",
        "corr diagnosis": "Pneumonia",
        "symptoms": [
            "muscle ache",
            "short breath",
            "chills"
        ]
    },
    {
        "": "59",
        "patient #": "59",
        "corr diagnosis": "Cardiac Arrest",
        "symptoms": [
            "fatigue",
            "rapid heart rate",
            "chest pain"
        ]
    },
    {
        "": "60",
        "patient #": "60",
        "corr diagnosis": "Stroke",
        "symptoms": [
            "dizziness",
            "trouble speaking",
            "numbness in one arm"
        ]
    },
    {
        "": "61",
        "patient #": "61",
        "corr diagnosis": "Stroke",
        "symptoms": [
            "trouble walking",
            "numbness in one arm",
            "dizziness"
        ]
    },
    {
        "": "62",
        "patient #": "62",
        "corr diagnosis": "Pneumonia",
        "symptoms": [
            "short breath",
            "muscle ache",
            "chills"
        ]
    },
    {
        "": "63",
        "patient #": "63",
        "corr diagnosis": "Pneumonia",
        "symptoms": [
            "chills",
            "muscle ache",
            "short breath"
        ]
    },
    {
        "": "64",
        "patient #": "64",
        "corr diagnosis": "Tuberculosis",
        "symptoms": [
            "swellings",
            "coughing blood",
            "fatigue"
        ]
    },
    {
        "": "65",
        "patient #": "65",
        "corr diagnosis": "Pneumonia",
        "symptoms": [
            "chills",
            "muscle ache",
            "short breath"
        ]
    },
    {
        "": "66",
        "patient #": "66",
        "corr diagnosis": "Cardiac Arrest",
        "symptoms": [
            "fatigue",
            "rapid heart rate",
            "chest pain"
        ]
    },
    {
        "": "67",
        "patient #": "67",
        "corr diagnosis": "Pneumonia",
        "symptoms": [
            "muscle ache",
            "chills",
            "short breath"
        ]
    },
    {
        "": "68",
        "patient #": "68",
        "corr diagnosis": "Pneumonia",
        "symptoms": [
            "chills",
            "short breath",
            "muscle ache"
        ]
    },
    {
        "": "69",
        "patient #": "69",
        "corr diagnosis": "Tuberculosis",
        "symptoms": [
            "fatigue",
            "cough",
            "coughing blood"
        ]
    },
    {
        "": "70",
        "patient #": "70",
        "corr diagnosis": "Stroke",
        "symptoms": [
            "numbness in one arm",
            "trouble speaking",
            "dizziness"
        ]
    },
    {
        "": "71",
        "patient #": "71",
        "corr diagnosis": "Tuberculosis",
        "symptoms": [
            "coughing blood",
            "cough",
            "swellings"
        ]
    },
    {
        "": "72",
        "patient #": "72",
        "corr diagnosis": "Stroke",
        "symptoms": [
            "dizziness",
            "numbness in one arm",
            "trouble speaking"
        ]
    },
    {
        "": "73",
        "patient #": "73",
        "corr diagnosis": "Stroke",
        "symptoms": [
            "trouble walking",
            "trouble speaking",
            "numbness in one arm"
        ]
    },
    {
        "": "74",
        "patient #": "74",
        "corr diagnosis": "Pneumonia",
        "symptoms": [
            "short breath",
            "chills",
            "muscle ache"
        ]
    },
    {
        "": "75",
        "patient #": "75",
        "corr diagnosis": "Stroke",
        "symptoms": [
            "numbness in one arm",
            "trouble walking",
            "dizziness"
        ]
    },
    {
        "": "76",
        "patient #": "76",
        "corr diagnosis": "Stroke",
        "symptoms": [
            "dizziness",
            "numbness in one arm",
            "trouble walking"
        ]
    },
    {
        "": "77",
        "patient #": "77",
        "corr diagnosis": "Cardiac Arrest",
        "symptoms": [
            "chest pain",
            "rapid heart rate",
            "fatigue"
        ]
    },
    {
        "": "78",
        "patient #": "78",
        "corr diagnosis": "Cardiac Arrest",
        "symptoms": [
            "chest pain",
            "fatigue",
            "rapid heart rate"
        ]
    },
    {
        "": "79",
        "patient #": "79",
        "corr diagnosis": "Stroke",
        "symptoms": [
            "trouble walking",
            "dizziness",
            "numbness in one arm"
        ]
    },
    {
        "": "80",
        "patient #": "80",
        "corr diagnosis": "Cardiac Arrest",
        "symptoms": [
            "chest pain",
            "fatigue",
            "rapid heart rate"
        ]
    },
    {
        "": "81",
        "patient #": "81",
        "corr diagnosis": "Pneumonia",
        "symptoms": [
            "muscle ache",
            "chills",
            "short breath"
        ]
    },
    {
        "": "82",
        "patient #": "82",
        "corr diagnosis": "Pneumonia",
        "symptoms": [
            "chills",
            "muscle ache",
            "short breath"
        ]
    },
    {
        "": "83",
        "patient #": "83",
        "corr diagnosis": "Tuberculosis",
        "symptoms": [
            "coughing blood",
            "swellings",
            "fatigue"
        ]
    },
    {
        "": "84",
        "patient #": "84",
        "corr diagnosis": "Cardiac Arrest",
        "symptoms": [
            "chest pain",
            "fatigue",
            "rapid heart rate"
        ]
    },
    {
        "": "85",
        "patient #": "85",
        "corr diagnosis": "Pneumonia",
        "symptoms": [
            "muscle ache",
            "short breath",
            "chills"
        ]
    },
    {
        "": "86",
        "patient #": "86",
        "corr diagnosis": "Stroke",
        "symptoms": [
            "trouble speaking",
            "numbness in one arm",
            "trouble walking"
        ]
    },
    {
        "": "87",
        "patient #": "87",
        "corr diagnosis": "Tuberculosis",
        "symptoms": [
            "coughing blood",
            "swellings",
            "cough"
        ]
    },
    {
        "": "88",
        "patient #": "88",
        "corr diagnosis": "Tuberculosis",
        "symptoms": [
            "swellings",
            "fatigue",
            "coughing blood"
        ]
    },
    {
        "": "89",
        "patient #": "89",
        "corr diagnosis": "Tuberculosis",
        "symptoms": [
            "fatigue",
            "cough",
            "coughing blood"
        ]
    },
    {
        "": "90",
        "patient #": "90",
        "corr diagnosis": "Tuberculosis",
        "symptoms": [
            "fatigue",
            "coughing blood",
            "cough"
        ]
    },
    {
        "": "91",
        "patient #": "91",
        "corr diagnosis": "Tuberculosis",
        "symptoms": [
            "fatigue",
            "swellings",
            "cough"
        ]
    },
    {
        "": "92",
        "patient #": "92",
        "corr diagnosis": "Pneumonia",
        "symptoms": [
            "muscle ache",
            "short breath",
            "chills"
        ]
    },
    {
        "": "93",
        "patient #": "93",
        "corr diagnosis": "Pneumonia",
        "symptoms": [
            "muscle ache",
            "short breath",
            "chills"
        ]
    },
    {
        "": "94",
        "patient #": "94",
        "corr diagnosis": "Cardiac Arrest",
        "symptoms": [
            "fatigue",
            "rapid heart rate",
            "chest pain"
        ]
    },
    {
        "": "95",
        "patient #": "95",
        "corr diagnosis": "Tuberculosis",
        "symptoms": [
            "fatigue",
            "coughing blood",
            "swellings"
        ]
    },
    {
        "": "96",
        "patient #": "96",
        "corr diagnosis": "Stroke",
        "symptoms": [
            "dizziness",
            "trouble speaking",
            "trouble walking"
        ]
    },
    {
        "": "97",
        "patient #": "97",
        "corr diagnosis": "Tuberculosis",
        "symptoms": [
            "swellings",
            "coughing blood",
            "fatigue"
        ]
    },
    {
        "": "98",
        "patient #": "98",
        "corr diagnosis": "Pneumonia",
        "symptoms": [
            "muscle ache",
            "chills",
            "short breath"
        ]
    },
    {
        "": "99",
        "patient #": "99",
        "corr diagnosis": "Pneumonia",
        "symptoms": [
            "chills",
            "muscle ache",
            "short breath"
        ]
    }
]

let formula_json =[
    {
        "": "0",
        "patient #": "0",
        "formula": "a",
        "a": 1,
        "b": 7,
        "difficulty": "0",
        "corr_answer": 1.0
    },
    {
        "": "1",
        "patient #": "1",
        "formula": "a + b/2",
        "a": 3,
        "b": 2,
        "difficulty": "2",
        "corr_answer": 4.0
    },
    {
        "": "2",
        "patient #": "2",
        "formula": "a + b",
        "a": 2,
        "b": 3,
        "difficulty": "1",
        "corr_answer": 5.0
    },
    {
        "": "3",
        "patient #": "3",
        "formula": "-a/4 + b",
        "a": 1,
        "b": 8,
        "difficulty": "4",
        "corr_answer": 7.75
    },
    {
        "": "4",
        "patient #": "4",
        "formula": "a + b",
        "a": 3,
        "b": 2,
        "difficulty": "1",
        "corr_answer": 5.0
    },
    {
        "": "5",
        "patient #": "5",
        "formula": "-a/4 + b",
        "a": 8,
        "b": 6,
        "difficulty": "3",
        "corr_answer": 4.0
    },
    {
        "": "7",
        "patient #": "7",
        "formula": "a + b/2",
        "a": 3,
        "b": 7,
        "difficulty": "3",
        "corr_answer": 6.5
    },
    {
        "": "8",
        "patient #": "8",
        "formula": "0 (This is an Attention check question, input 1)",
        "a": 7,
        "b": 2,
        "difficulty": "0",
        "corr_answer": 0.0
    },
    {
        "": "9",
        "patient #": "9",
        "formula": "a/2",
        "a": 1,
        "b": 2,
        "difficulty": "2",
        "corr_answer": 0.5
    },
    {
        "": "10",
        "patient #": "10",
        "formula": "a + b",
        "a": 4,
        "b": 2,
        "difficulty": "1",
        "corr_answer": 6.0
    },
    {
        "": "11",
        "patient #": "11",
        "formula": "-a/4 + b",
        "a": 3,
        "b": 3,
        "difficulty": "4",
        "corr_answer": 2.25
    },
    {
        "": "12",
        "patient #": "12",
        "formula": "a + b/2",
        "a": 3,
        "b": 3,
        "difficulty": "3",
        "corr_answer": 4.5
    },
    {
        "": "13",
        "patient #": "13",
        "formula": "a/2",
        "a": 4,
        "b": 5,
        "difficulty": "1",
        "corr_answer": 2.0
    },
    {
        "": "14",
        "patient #": "14",
        "formula": "-a/4 + b",
        "a": 4,
        "b": 7,
        "difficulty": "3",
        "corr_answer": 6.0
    },
    {
        "": "15",
        "patient #": "15",
        "formula": "a/2",
        "a": 5,
        "b": 9,
        "difficulty": "2",
        "corr_answer": 2.5
    },
    {
        "": "17",
        "patient #": "17",
        "formula": "a + b",
        "a": 6,
        "b": 4,
        "difficulty": "1",
        "corr_answer": 10.0
    },
    {
        "": "18",
        "patient #": "18",
        "formula": "a",
        "a": 8,
        "b": 5,
        "difficulty": "0",
        "corr_answer": 8.0
    },
    {
        "": "19",
        "patient #": "19",
        "formula": "a + b/2",
        "a": 3,
        "b": 3,
        "difficulty": "3",
        "corr_answer": 4.5
    },
    {
        "": "20",
        "patient #": "20",
        "formula": "a",
        "a": 7,
        "b": 4,
        "difficulty": "0",
        "corr_answer": 7.0
    },
    {
        "": "21",
        "patient #": "21",
        "formula": "a + b/2",
        "a": 1,
        "b": 10,
        "difficulty": "2",
        "corr_answer": 6.0
    },
    {
        "": "22",
        "patient #": "22",
        "formula": "a + b",
        "a": 1,
        "b": 3,
        "difficulty": "1",
        "corr_answer": 4.0
    },
    {
        "": "24",
        "patient #": "24",
        "formula": "a/2",
        "a": 4,
        "b": 6,
        "difficulty": "1",
        "corr_answer": 2.0
    },
    {
        "": "25",
        "patient #": "25",
        "formula": "a",
        "a": 5,
        "b": 10,
        "difficulty": "0",
        "corr_answer": 5.0
    },
    {
        "": "28",
        "patient #": "28",
        "formula": "a",
        "a": 5,
        "b": 5,
        "difficulty": "0",
        "corr_answer": 5.0
    },
    {
        "": "29",
        "patient #": "29",
        "formula": "a + b",
        "a": 1,
        "b": 7,
        "difficulty": "1",
        "corr_answer": 8.0
    },
    {
        "": "30",
        "patient #": "30",
        "formula": "-a/4 + b",
        "a": 1,
        "b": 9,
        "difficulty": "4",
        "corr_answer": 8.75
    },
    {
        "": "31",
        "patient #": "31",
        "formula": "-a/4 + b",
        "a": 6,
        "b": 3,
        "difficulty": "4",
        "corr_answer": 1.5
    },
    {
        "": "32",
        "patient #": "32",
        "formula": "a + b",
        "a": 1,
        "b": 7,
        "difficulty": "1",
        "corr_answer": 8.0
    },
    {
        "": "33",
        "patient #": "33",
        "formula": "-a/4 + b",
        "a": 4,
        "b": 4,
        "difficulty": "3",
        "corr_answer": 3.0
    },
    {
        "": "34",
        "patient #": "34",
        "formula": "a",
        "a": 7,
        "b": 9,
        "difficulty": "0",
        "corr_answer": 7.0
    },
    {
        "": "35",
        "patient #": "35",
        "formula": "a",
        "a": 8,
        "b": 6,
        "difficulty": "0",
        "corr_answer": 8.0
    },
    {
        "": "36",
        "patient #": "36",
        "formula": "-a/4 + b",
        "a": 1,
        "b": 2,
        "difficulty": "4",
        "corr_answer": 1.75
    },
    {
        "": "37",
        "patient #": "37",
        "formula": "a + b",
        "a": 2,
        "b": 7,
        "difficulty": "1",
        "corr_answer": 9.0
    },
    {
        "": "38",
        "patient #": "38",
        "formula": "a/2",
        "a": 1,
        "b": 3,
        "difficulty": "2",
        "corr_answer": 0.5
    },
    {
        "": "39",
        "patient #": "39",
        "formula": "a",
        "a": 6,
        "b": 3,
        "difficulty": "0",
        "corr_answer": 6.0
    },
    {
        "": "40",
        "patient #": "40",
        "formula": "-a/4 + b",
        "a": 8,
        "b": 3,
        "difficulty": "3",
        "corr_answer": 1.0
    },
    {
        "": "41",
        "patient #": "41",
        "formula": "a + b/2",
        "a": 7,
        "b": 3,
        "difficulty": "3",
        "corr_answer": 8.5
    },
    {
        "": "42",
        "patient #": "42",
        "formula": "a",
        "a": 3,
        "b": 4,
        "difficulty": "0",
        "corr_answer": 3.0
    },
    {
        "": "43",
        "patient #": "43",
        "formula": "a/2",
        "a": 3,
        "b": 3,
        "difficulty": "2",
        "corr_answer": 1.5
    },
    {
        "": "44",
        "patient #": "44",
        "formula": "a/2",
        "a": 7,
        "b": 9,
        "difficulty": "2",
        "corr_answer": 3.5
    },
    {
        "": "47",
        "patient #": "47",
        "formula": "-a/4 + b",
        "a": 6,
        "b": 7,
        "difficulty": "4",
        "corr_answer": 5.5
    },
    {
        "": "48",
        "patient #": "48",
        "formula": "a/2",
        "a": 4,
        "b": 3,
        "difficulty": "1",
        "corr_answer": 2.0
    },
    {
        "": "49",
        "patient #": "49",
        "formula": "a + b/2",
        "a": 1,
        "b": 5,
        "difficulty": "3",
        "corr_answer": 3.5
    },
    {
        "": "51",
        "patient #": "51",
        "formula": "a",
        "a": 4,
        "b": 10,
        "difficulty": "0",
        "corr_answer": 4.0
    },
    {
        "": "52",
        "patient #": "52",
        "formula": "a",
        "a": 3,
        "b": 7,
        "difficulty": "0",
        "corr_answer": 3.0
    },
    {
        "": "53",
        "patient #": "53",
        "formula": "a + b/2",
        "a": 2,
        "b": 4,
        "difficulty": "2",
        "corr_answer": 4.0
    },
    {
        "": "54",
        "patient #": "54",
        "formula": "-a/4 + b",
        "a": 1,
        "b": 2,
        "difficulty": "4",
        "corr_answer": 1.75
    },
    {
        "": "55",
        "patient #": "55",
        "formula": "a",
        "a": 2,
        "b": 2,
        "difficulty": "0",
        "corr_answer": 2.0
    },
    {
        "": "57",
        "patient #": "57",
        "formula": "-a/4 + b",
        "a": 3,
        "b": 5,
        "difficulty": "4",
        "corr_answer": 4.25
    },
    {
        "": "58",
        "patient #": "58",
        "formula": "-a/4 + b",
        "a": 8,
        "b": 6,
        "difficulty": "3",
        "corr_answer": 4.0
    },
    {
        "": "59",
        "patient #": "59",
        "formula": "a + b/2",
        "a": 2,
        "b": 8,
        "difficulty": "2",
        "corr_answer": 6.0
    },
    {
        "": "61",
        "patient #": "61",
        "formula": "a/2",
        "a": 5,
        "b": 2,
        "difficulty": "2",
        "corr_answer": 2.5
    },
    {
        "": "62",
        "patient #": "62",
        "formula": "a",
        "a": 7,
        "b": 7,
        "difficulty": "0",
        "corr_answer": 7.0
    },
    {
        "": "63",
        "patient #": "63",
        "formula": "a + b/2",
        "a": 6,
        "b": 7,
        "difficulty": "3",
        "corr_answer": 9.5
    },
    {
        "": "64",
        "patient #": "64",
        "formula": "a",
        "a": 5,
        "b": 10,
        "difficulty": "0",
        "corr_answer": 5.0
    },
    {
        "": "65",
        "patient #": "65",
        "formula": "-a/4 + b",
        "a": 8,
        "b": 9,
        "difficulty": "3",
        "corr_answer": 7.0
    },
    {
        "": "66",
        "patient #": "66",
        "formula": "a",
        "a": 4,
        "b": 8,
        "difficulty": "0",
        "corr_answer": 4.0
    },
    {
        "": "67",
        "patient #": "67",
        "formula": "-a/4 + b",
        "a": 3,
        "b": 10,
        "difficulty": "4",
        "corr_answer": 9.25
    },
    {
        "": "68",
        "patient #": "68",
        "formula": "a + b/2",
        "a": 4,
        "b": 6,
        "difficulty": "2",
        "corr_answer": 7.0
    },
    {
        "": "69",
        "patient #": "69",
        "formula": "a + b",
        "a": 1,
        "b": 4,
        "difficulty": "1",
        "corr_answer": 5.0
    },
    {
        "": "71",
        "patient #": "71",
        "formula": "a",
        "a": 5,
        "b": 9,
        "difficulty": "0",
        "corr_answer": 5.0
    },
    {
        "": "72",
        "patient #": "72",
        "formula": "a + b",
        "a": 6,
        "b": 2,
        "difficulty": "1",
        "corr_answer": 8.0
    },
    {
        "": "73",
        "patient #": "73",
        "formula": "-a/4 + b",
        "a": 1,
        "b": 5,
        "difficulty": "4",
        "corr_answer": 4.75
    },
    {
        "": "74",
        "patient #": "74",
        "formula": "a",
        "a": 5,
        "b": 5,
        "difficulty": "0",
        "corr_answer": 5.0
    },
    {
        "": "76",
        "patient #": "76",
        "formula": "a",
        "a": 2,
        "b": 7,
        "difficulty": "0",
        "corr_answer": 2.0
    },
    {
        "": "78",
        "patient #": "78",
        "formula": "a",
        "a": 4,
        "b": 3,
        "difficulty": "0",
        "corr_answer": 4.0
    },
    {
        "": "79",
        "patient #": "79",
        "formula": "a + b",
        "a": 1,
        "b": 2,
        "difficulty": "1",
        "corr_answer": 3.0
    },
    {
        "": "80",
        "patient #": "80",
        "formula": "a/2",
        "a": 4,
        "b": 10,
        "difficulty": "1",
        "corr_answer": 2.0
    },
    {
        "": "81",
        "patient #": "81",
        "formula": "a/2",
        "a": 1,
        "b": 4,
        "difficulty": "2",
        "corr_answer": 0.5
    },
    {
        "": "82",
        "patient #": "82",
        "formula": "-a/4 + b",
        "a": 3,
        "b": 4,
        "difficulty": "4",
        "corr_answer": 3.25
    },
    {
        "": "83",
        "patient #": "83",
        "formula": "a + b/2",
        "a": 5,
        "b": 8,
        "difficulty": "2",
        "corr_answer": 9.0
    },
    {
        "": "84",
        "patient #": "84",
        "formula": "a/2",
        "a": 5,
        "b": 9,
        "difficulty": "2",
        "corr_answer": 2.5
    },
    {
        "": "85",
        "patient #": "85",
        "formula": "a/2",
        "a": 1,
        "b": 4,
        "difficulty": "2",
        "corr_answer": 0.5
    },
    {
        "": "86",
        "patient #": "86",
        "formula": "a",
        "a": 3,
        "b": 10,
        "difficulty": "0",
        "corr_answer": 3.0
    },
    {
        "": "87",
        "patient #": "87",
        "formula": "a + b",
        "a": 3,
        "b": 3,
        "difficulty": "1",
        "corr_answer": 6.0
    },
    {
        "": "88",
        "patient #": "88",
        "formula": "-a/4 + b",
        "a": 7,
        "b": 6,
        "difficulty": "4",
        "corr_answer": 4.25
    },
    {
        "": "89",
        "patient #": "89",
        "formula": "a + b/2",
        "a": 5,
        "b": 3,
        "difficulty": "3",
        "corr_answer": 6.5
    },
    {
        "": "91",
        "patient #": "91",
        "formula": "a/2",
        "a": 5,
        "b": 2,
        "difficulty": "2",
        "corr_answer": 2.5
    },
    {
        "": "92",
        "patient #": "92",
        "formula": "a + b/2",
        "a": 5,
        "b": 6,
        "difficulty": "2",
        "corr_answer": 8.0
    },
    {
        "": "93",
        "patient #": "93",
        "formula": "-a/4 + b",
        "a": 8,
        "b": 2,
        "difficulty": "3",
        "corr_answer": 0.0
    },
    {
        "": "94",
        "patient #": "94",
        "formula": "a + b/2",
        "a": 1,
        "b": 8,
        "difficulty": "2",
        "corr_answer": 5.0
    },
    {
        "": "96",
        "patient #": "96",
        "formula": "a + b/2",
        "a": 2,
        "b": 9,
        "difficulty": "3",
        "corr_answer": 6.5
    },
    {
        "": "97",
        "patient #": "97",
        "formula": "a + b/2",
        "a": 7,
        "b": 6,
        "difficulty": "2",
        "corr_answer": 10.0
    },
    {
        "": "98",
        "patient #": "98",
        "formula": "a/2",
        "a": 4,
        "b": 4,
        "difficulty": "1",
        "corr_answer": 2.0
    },
    {
        "": "99",
        "patient #": "99",
        "formula": "a/2",
        "a": 8,
        "b": 10,
        "difficulty": "1",
        "corr_answer": 4.0
    }
]

let number_search_json = [
    {
        "": "1",
        "NS_number": "1",
        "NS_image": "https://www.dropbox.com/scl/fi/638ssf6y61qx5qj8fmox5/table1.png?rlkey=orr139jmsws2z5dt39ispxe1w&st=ppj8mxra&raw=1",
        "number_to_search_for": 6,
        "difficulty": 0,
        "correct_answer": 1.0
    },
    {
        "": "2",
        "NS_number": "2",
        "NS_image": "https://www.dropbox.com/scl/fi/aqjaqx45ivgvl4nkcog5y/table2.png?rlkey=qwc06w0cli1lzobb3564znta9&st=5vlv3oq1&raw=1",
        "number_to_search_for": 1,
        "difficulty": 1,
        "correct_answer": 1.0
    },
    {
        "": "3",
        "NS_number": "3",
        "NS_image": "https://www.dropbox.com/scl/fi/vn7ldbqkt8se5p7nlvlee/table3.png?rlkey=fvvqufmdyf41wp47jlaf4pwex&st=ctxi9lys&raw=1",
        "number_to_search_for": 6,
        "difficulty": 0,
        "correct_answer": 1.0
    },
    {
        "": "4",
        "NS_number": "4",
        "NS_image": "https://www.dropbox.com/scl/fi/s29mby4ignatwq0b9zajg/table4.png?rlkey=dq0ouqw6rb21u1pb13yvicot6&st=ekpg64kz&raw=1",
        "number_to_search_for": 6,
        "difficulty": 2,
        "correct_answer": 8.0
    },
    {
        "": "5",
        "NS_number": "5",
        "NS_image": "https://www.dropbox.com/scl/fi/fkqfrkbhjai700gaihrhq/table5.png?rlkey=2dskja0yy46z89aaa0g92znss&st=jhl6fuoo&raw=1",
        "number_to_search_for": 2,
        "difficulty": 1,
        "correct_answer": 2.0
    },
    {
        "": "6",
        "NS_number": "6",
        "NS_image": "https://www.dropbox.com/scl/fi/0gvo6m7uc21nsvu5mhl1b/table6.png?rlkey=py8qwiamct5cuvu205hfg7uqd&st=p4j82ipx&raw=1",
        "number_to_search_for": 8,
        "difficulty": 1,
        "correct_answer": 2.0
    },
    {
        "": "7",
        "NS_number": "7",
        "NS_image": "https://www.dropbox.com/scl/fi/1hht0qjl0wpbkkylfyrvx/table7.png?rlkey=cwm3yqiwmtp5fu1qh4mcse519&st=f4sh76q2&raw=1",
        "number_to_search_for": 4,
        "difficulty": 0,
        "correct_answer": 0.0
    },
    {
        "": "8",
        "NS_number": "8",
        "NS_image": "https://www.dropbox.com/scl/fi/x7swp4bho7e3hsr2pi4hk/table8.png?rlkey=abt8sf1sgppuagtja6waft97d&st=5ix95r2x&raw=1",
        "number_to_search_for": 3,
        "difficulty": 0,
        "correct_answer": 2.0
    },
    {
        "": "10",
        "NS_number": "10",
        "NS_image": "https://www.dropbox.com/scl/fi/j1d9oavufiucja5tv2z58/table10.png?rlkey=l5tcr4kacb6tnk0brgkvcbyqg&st=qvci1uof&raw=1",
        "number_to_search_for": 9,
        "difficulty": 1,
        "correct_answer": 1.0
    },
    {
        "": "11",
        "NS_number": "11",
        "NS_image": "https://www.dropbox.com/scl/fi/j3zhbw3iz63h9by17ypn8/table11.png?rlkey=855ggaaumzmycemm26w9hm727&st=byac6f7j&raw=1",
        "number_to_search_for": 9,
        "difficulty": 1,
        "correct_answer": 1.0
    },
    {
        "": "12",
        "NS_number": "12",
        "NS_image": "https://www.dropbox.com/scl/fi/32gg14c0p964mfmub256s/table12.png?rlkey=4wttbui90nuynstmfnrmu58n0&st=1jvbhw94&raw=1",
        "number_to_search_for": 9,
        "difficulty": 0,
        "correct_answer": 1.0
    },
    {
        "": "13",
        "NS_number": "13",
        "NS_image": "https://www.dropbox.com/scl/fi/q2hz4owsw4836i5nav0v6/table13.png?rlkey=oi9xwyofzo6nalplfx9g0rm9k&st=ow70q6ez&raw=1",
        "number_to_search_for": 1,
        "difficulty": 1,
        "correct_answer": 2.0
    },
    {
        "": "14",
        "NS_number": "14",
        "NS_image": "https://www.dropbox.com/scl/fi/ikw7edly2x53neowgq1v4/table14.png?rlkey=x4z2uxpwiayquxtypi1ujgyq3&st=nwlfdxs8&raw=1",
        "number_to_search_for": 3,
        "difficulty": 2,
        "correct_answer": 9.0
    },
    {
        "": "15",
        "NS_number": "15",
        "NS_image": "https://www.dropbox.com/scl/fi/p4lsuqvyczq92x5ayjpti/table15.png?rlkey=h2b6f45xwkkkclly2gzxh0s99&raw=1",
        "number_to_search_for": 5,
        "difficulty": 1,
        "correct_answer": 5.0
    },
    {
        "": "16",
        "NS_number": "16",
        "NS_image": "https://www.dropbox.com/scl/fi/i8r4web6ljmrdxh3r7m2t/table16.png?rlkey=3eo5hi3oq6cpn5eodmx0zrpr4&raw=1",
        "number_to_search_for": 5,
        "difficulty": 0,
        "correct_answer": 1.0
    },
    {
        "": "17",
        "NS_number": "17",
        "NS_image": "https://www.dropbox.com/scl/fi/xwc53cue0q7mf32x458s0/table17.png?rlkey=0cjwnapblliljqq9nbeksfhtf&raw=1",
        "number_to_search_for": 4,
        "difficulty": 1,
        "correct_answer": 5.0
    },
    {
        "": "18",
        "NS_number": "18",
        "NS_image": "https://www.dropbox.com/scl/fi/zxzfd49ti8fqwu79siows/table18.png?rlkey=4bo5fjcvvg0e0j0zcasb45q8g&raw=1",
        "number_to_search_for": 6,
        "difficulty": 0,
        "correct_answer": 2.0
    },
    {
        "": "19",
        "NS_number": "19",
        "NS_image": "https://www.dropbox.com/scl/fi/ci6riwpm3ppy6kpljhpwr/table19.png?rlkey=o6gujtgyjka9q7nt141xcsh93&raw=1",
        "number_to_search_for": 6,
        "difficulty": 0,
        "correct_answer": 3.0
    },
    {
        "": "21",
        "NS_number": "21",
        "NS_image": "https://www.dropbox.com/scl/fi/g2ftypxffgfm066omvism/table21.png?rlkey=yj59is7gerxlfnu45ngjrabsd&raw=1",
        "number_to_search_for": 8,
        "difficulty": 1,
        "correct_answer": 3.0
    },
    {
        "": "22",
        "NS_number": "22",
        "NS_image": "https://www.dropbox.com/scl/fi/u4r9d86r5yo1rl8ttr0j5/table22.png?rlkey=jbd7jlfsrrt3d406alnyxxrgq&raw=1",
        "number_to_search_for": 8,
        "difficulty": 2,
        "correct_answer": 4.0
    },
    {
        "": "23",
        "NS_number": "23",
        "NS_image": "https://www.dropbox.com/scl/fi/hdf7pvzbsf817qvchia9e/table23.png?rlkey=451zeyxa4wx81drdfoea969a4&raw=1",
        "number_to_search_for": 4,
        "difficulty": 2,
        "correct_answer": 5.0
    },
    {
        "": "24",
        "NS_number": "24",
        "NS_image": "https://www.dropbox.com/scl/fi/vm3faepyw868slekg6zsb/table24.png?rlkey=9l342qsrmrtbzy379081k8n4f&raw=1",
        "number_to_search_for": 6,
        "difficulty": 1,
        "correct_answer": 3.0
    },
    {
        "": "25",
        "NS_number": "25",
        "NS_image": "https://www.dropbox.com/scl/fi/u82qi2q2qinpal9cj7chw/table25.png?rlkey=6zgd0t2jt8c7hivofgunk9gnb&raw=1",
        "number_to_search_for": 5,
        "difficulty": 1,
        "correct_answer": 2.0
    },
    {
        "": "26",
        "NS_number": "26",
        "NS_image": "https://www.dropbox.com/scl/fi/50fo98oohmr0wpqttz0t5/table26.png?rlkey=x3scppipguwoen3yzjt56knqw&raw=1",
        "number_to_search_for": 4,
        "difficulty": 2,
        "correct_answer": 5.0
    },
    {
        "": "27",
        "NS_number": "27",
        "NS_image": "https://www.dropbox.com/scl/fi/7lejoz6ncc33tjkx5mfdx/table27.png?rlkey=stgkez4tepspt4a435ohott7z&raw=1",
        "number_to_search_for": 8,
        "difficulty": 1,
        "correct_answer": 3.0
    },
    {
        "": "28",
        "NS_number": "28",
        "NS_image": "https://www.dropbox.com/scl/fi/1wownll8a3o3300e465jt/table28.png?rlkey=31po3z2fvfavgy9bbxfjaakxe&raw=1",
        "number_to_search_for": 9,
        "difficulty": 2,
        "correct_answer": 7.0
    },
    {
        "": "29",
        "NS_number": "29",
        "NS_image": "https://www.dropbox.com/scl/fi/tk3ng4dhk57j5wh96uc2n/table29.png?rlkey=xs5whps9d1jlg6pnef430sfbf&raw=1",
        "number_to_search_for": 7,
        "difficulty": 0,
        "correct_answer": 1.0
    },
    {
        "": "30",
        "NS_number": "30",
        "NS_image": "https://www.dropbox.com/scl/fi/lqjmr8zs06123g0w3r3zd/table30.png?rlkey=aml2cisotp9jywva0x01wlz7r&raw=1",
        "number_to_search_for": 3,
        "difficulty": 0,
        "correct_answer": 1.0
    },
    {
        "": "31",
        "NS_number": "31",
        "NS_image": "https://www.dropbox.com/scl/fi/qrrpcxt8u99k5howhv2nw/table31.png?rlkey=xxznifdp0yit83tjr5q5b9sr7&raw=1",
        "number_to_search_for": 4,
        "difficulty": 2,
        "correct_answer": 6.0
    },
    {
        "": "32",
        "NS_number": "32",
        "NS_image": "https://www.dropbox.com/scl/fi/z065lnmiw0f4oviyp39cw/table32.png?rlkey=9iwx6cy0cil5rgkjlgv5gdm1f&raw=1",
        "number_to_search_for": 7,
        "difficulty": 0,
        "correct_answer": 3.0
    },
    {
        "": "33",
        "NS_number": "33",
        "NS_image": "https://www.dropbox.com/scl/fi/9y1wq9cctekxn0f96cxaf/table33.png?rlkey=xb1hkjokk9u6uazxlk13r7w60&raw=1",
        "number_to_search_for": 1,
        "difficulty": 1,
        "correct_answer": 2.0
    },
    {
        "": "35",
        "NS_number": "35",
        "NS_image": "https://www.dropbox.com/scl/fi/j5wi5f2kkajptrs5hnjx0/table35.png?rlkey=kugbxqrhajj3wd0lufapccu3j&raw=1",
        "number_to_search_for": 4,
        "difficulty": 0,
        "correct_answer": 1.0
    },
    {
        "": "36",
        "NS_number": "36",
        "NS_image": "https://www.dropbox.com/scl/fi/fj1ul5qmmg4kagwfd8xe0/table36.png?rlkey=c5xj1zeru47lcyiockepg79vr&raw=1",
        "number_to_search_for": 6,
        "difficulty": 1,
        "correct_answer": 2.0
    },
    {
        "": "37",
        "NS_number": "37",
        "NS_image": "https://www.dropbox.com/scl/fi/2w7c2e0tgn6mghjpjhx8j/table37.png?rlkey=cqx3rdqr0vg53qlvcs92d7wjo&raw=1",
        "number_to_search_for": 3,
        "difficulty": 1,
        "correct_answer": 5.0
    },
    {
        "": "38",
        "NS_number": "38",
        "NS_image": "https://www.dropbox.com/scl/fi/g7bgb220nao92rfhht3xf/table38.png?rlkey=nhws66ffq6td4swjuvjt74wbb&raw=1",
        "number_to_search_for": 7,
        "difficulty": 1,
        "correct_answer": 1.0
    },
    {
        "": "39",
        "NS_number": "39",
        "NS_image": "https://www.dropbox.com/scl/fi/gn8dg7h380pzu0hkym962/table39.png?rlkey=c9w04480imwwransryo78md8j&raw=1",
        "number_to_search_for": 6,
        "difficulty": 1,
        "correct_answer": 1.0
    },
    {
        "": "40",
        "NS_number": "40",
        "NS_image": "https://www.dropbox.com/scl/fi/8dprp5omm98mq8xymcl09/table40.png?rlkey=m0pcz3dqccev2ozawogsevpgd&raw=1",
        "number_to_search_for": 9,
        "difficulty": 0,
        "correct_answer": 1.0
    },
    {
        "": "41",
        "NS_number": "41",
        "NS_image": "https://www.dropbox.com/scl/fi/qwqpd77zr0h65im7fp9fr/table41.png?rlkey=szeeynqufjwwpvgb5usdc7uuv&raw=1",
        "number_to_search_for": 8,
        "difficulty": 2,
        "correct_answer": 7.0
    },
    {
        "": "43",
        "NS_number": "43",
        "NS_image": "https://www.dropbox.com/scl/fi/tplcjqi4l4kfykkunm4j8/table43.png?rlkey=6s8lwja4klz8gzf6kj9onpa17&raw=1",
        "number_to_search_for": 8,
        "difficulty": 1,
        "correct_answer": 1.0
    },
    {
        "": "44",
        "NS_number": "44",
        "NS_image": "https://www.dropbox.com/scl/fi/6hlng8v3zsnyvtf0gff0f/table44.png?rlkey=u1tk7l5xe778ajll4rq3l6h6t&raw=1",
        "number_to_search_for": "This is an attention check question, input 0",
        "difficulty": 0,
        "correct_answer": 0.0
    },
    {
        "": "45",
        "NS_number": "45",
        "NS_image": "https://www.dropbox.com/scl/fi/5v39rvvto03logn5l9ad3/table45.png?rlkey=3wezkplc3q2qjgbcie1h39ics&raw=1",
        "number_to_search_for": 1,
        "difficulty": 2,
        "correct_answer": 5.0
    },
    {
        "": "46",
        "NS_number": "46",
        "NS_image": "https://www.dropbox.com/scl/fi/25nmare2xjmzijquzbhg6/table46.png?rlkey=yztvuewmoah3jvohnzgqqpmfa&raw=1",
        "number_to_search_for": 3,
        "difficulty": 2,
        "correct_answer": 3.0
    },
    {
        "": "47",
        "NS_number": "47",
        "NS_image": "https://www.dropbox.com/scl/fi/e2e8fnaji2lbibb3nxdut/table47.png?rlkey=6vdh0kopn1kf7gky7i0odghd9&raw=1",
        "number_to_search_for": 4,
        "difficulty": 2,
        "correct_answer": 5.0
    },
    {
        "": "48",
        "NS_number": "48",
        "NS_image": "https://www.dropbox.com/scl/fi/ydudze9ibl1ijgzdu76tk/table48.png?rlkey=p7ejhbdvw55sxzfab5dpflt5n&raw=1",
        "number_to_search_for": 5,
        "difficulty": 0,
        "correct_answer": 2.0
    },
    {
        "": "49",
        "NS_number": "49",
        "NS_image": "https://www.dropbox.com/scl/fi/jcnr9ngmjm1gp0cwpf8uc/table49.png?rlkey=qmrnjxx8b6tgcwk0eat2sucuo&raw=1",
        "number_to_search_for": 4,
        "difficulty": 1,
        "correct_answer": 4.0
    },
    {
        "": "50",
        "NS_number": "50",
        "NS_image": "https://www.dropbox.com/scl/fi/auktm33pigdbc63znsa2k/table50.png?rlkey=vfco295dy7mwwdmbz7z65upqb&raw=1",
        "number_to_search_for": 6,
        "difficulty": 1,
        "correct_answer": 4.0
    },
    {
        "": "51",
        "NS_number": "51",
        "NS_image": "https://www.dropbox.com/scl/fi/z4zevdmjs9ok8nwu9je44/table51.png?rlkey=ugtkxid49dw1fi7djh42mqu0y&raw=1",
        "number_to_search_for": 5,
        "difficulty": 1,
        "correct_answer": 2.0
    },
    {
        "": "52",
        "NS_number": "52",
        "NS_image": "https://www.dropbox.com/scl/fi/7o5us1g88iws5i3gix7la/table52.png?rlkey=wpgpj3g17qz1m5jovqjidlt1n&raw=1",
        "number_to_search_for": 2,
        "difficulty": 2,
        "correct_answer": 1.0
    },
    {
        "": "53",
        "NS_number": "53",
        "NS_image": "https://www.dropbox.com/scl/fi/mn49gei3wkn1sci67ulcl/table53.png?rlkey=ced49croleggq2h94blpdpzqo&raw=1",
        "number_to_search_for": 1,
        "difficulty": 2,
        "correct_answer": 4.0
    },
    {
        "": "54",
        "NS_number": "54",
        "NS_image": "https://www.dropbox.com/scl/fi/eqqj5el18zu45vl43okrx/table54.png?rlkey=ekqaul60tg14py7dmoz188ldv&raw=1",
        "number_to_search_for": 8,
        "difficulty": 1,
        "correct_answer": 5.0
    },
    {
        "": "56",
        "NS_number": "56",
        "NS_image": "https://www.dropbox.com/scl/fi/3zqejb5x5qep2duthzm6n/table56.png?rlkey=5z2dk9xrmvjs28s67qmwjfrb0&raw=1",
        "number_to_search_for": 7,
        "difficulty": 1,
        "correct_answer": 2.0
    },
    {
        "": "57",
        "NS_number": "57",
        "NS_image": "https://www.dropbox.com/scl/fi/z7obno9801duek2bjnfps/table57.png?rlkey=u6jwd14xu79jzwqblczmh0k53&raw=1",
        "number_to_search_for": 6,
        "difficulty": 2,
        "correct_answer": 5.0
    },
    {
        "": "58",
        "NS_number": "58",
        "NS_image": "https://www.dropbox.com/scl/fi/aih447sl2rrmrwg5xfrha/table58.png?rlkey=wc768xw4ypf5oe3x2rnqz8jrz&raw=1",
        "number_to_search_for": 8,
        "difficulty": 0,
        "correct_answer": 3.0
    },
    {
        "": "60",
        "NS_number": "60",
        "NS_image": "https://www.dropbox.com/scl/fi/abcy0vx76pi09znpbnqic/table60.png?rlkey=d4ecz3g1bz4u29g1o3zegv3rg&raw=1",
        "number_to_search_for": 7,
        "difficulty": 0,
        "correct_answer": 3.0
    },
    {
        "": "61",
        "NS_number": "61",
        "NS_image": "https://www.dropbox.com/scl/fi/re9m3ub0smiiska5py6zb/table61.png?rlkey=4jf3ku4xea1fhej9vxaha0qxb&raw=1",
        "number_to_search_for": 7,
        "difficulty": 2,
        "correct_answer": 7.0
    },
    {
        "": "62",
        "NS_number": "62",
        "NS_image": "https://www.dropbox.com/scl/fi/3ar356003l1ad4xcjso1a/table62.png?rlkey=it6sb7ngnmf9d9yxb6bk29mho&raw=1",
        "number_to_search_for": 5,
        "difficulty": 2,
        "correct_answer": 6.0
    },
    {
        "": "63",
        "NS_number": "63",
        "NS_image": "https://www.dropbox.com/scl/fi/n7ur3oot33wvkxes34l4b/table63.png?rlkey=qgqymkp1dyvzfcrjct73xwiw9&raw=1",
        "number_to_search_for": 1,
        "difficulty": 0,
        "correct_answer": 2.0
    },
    {
        "": "64",
        "NS_number": "64",
        "NS_image": "https://www.dropbox.com/scl/fi/xdybtq1ewnzlo2dwylz6q/table64.png?rlkey=ezrwhyjbt9wi2cpuyw4m5kioq&raw=1",
        "number_to_search_for": 7,
        "difficulty": 1,
        "correct_answer": 2.0
    },
    {
        "": "65",
        "NS_number": "65",
        "NS_image": "https://www.dropbox.com/scl/fi/95j41e1urax0xmbqq88l4/table65.png?rlkey=zfovohfeoh1e2jtb3sebj9eos&raw=1",
        "number_to_search_for": 8,
        "difficulty": 0,
        "correct_answer": 1.0
    },
    {
        "": "66",
        "NS_number": "66",
        "NS_image": "https://www.dropbox.com/scl/fi/tp8l45biz5n7qgqky7t7f/table66.png?rlkey=0rst18mcliwy8dh2128y1zo9o&raw=1",
        "number_to_search_for": 1,
        "difficulty": 0,
        "correct_answer": 2.0
    },
    {
        "": "67",
        "NS_number": "67",
        "NS_image": "https://www.dropbox.com/scl/fi/m6duvdf9kj8kpl9k4eoyy/table67.png?rlkey=n945u7h5e93aprejmbkxqsl4p&raw=1",
        "number_to_search_for": 5,
        "difficulty": 2,
        "correct_answer": 4.0
    },
    {
        "": "68",
        "NS_number": "68",
        "NS_image": "https://www.dropbox.com/scl/fi/kx3vviwk1igumowwmq5kf/table68.png?rlkey=56bcx42jhmc3vn0ebhgu1hsef&raw=1",
        "number_to_search_for": 5,
        "difficulty": 0,
        "correct_answer": 1.0
    },
    {
        "": "70",
        "NS_number": "70",
        "NS_image": "https://www.dropbox.com/scl/fi/q3b7oxtlltdts687ctz08/table70.png?rlkey=cmlnqu0pb5mn7fuu4ovuze2d8&raw=1",
        "number_to_search_for": 4,
        "difficulty": 2,
        "correct_answer": 6.0
    },
    {
        "": "71",
        "NS_number": "71",
        "NS_image": "https://www.dropbox.com/scl/fi/ghdeb8ssi3tt80q8f6oat/table71.png?rlkey=n38yw66cjqyc6l0a0tqercuny&raw=1",
        "number_to_search_for": 9,
        "difficulty": 1,
        "correct_answer": 2.0
    },
    {
        "": "72",
        "NS_number": "72",
        "NS_image": "https://www.dropbox.com/scl/fi/79qhmylouagm5ff9hnh56/table72.png?rlkey=5lpt0fqutrr0i50dbeyej8d9u&raw=1",
        "number_to_search_for": 7,
        "difficulty": 0,
        "correct_answer": 1.0
    },
    {
        "": "73",
        "NS_number": "73",
        "NS_image": "https://www.dropbox.com/scl/fi/20w0ti8h2cekazre5brw7/table73.png?rlkey=bdjr29qsn7obkianthopcgod6&raw=1",
        "number_to_search_for": 1,
        "difficulty": 0,
        "correct_answer": 3.0
    },
    {
        "": "74",
        "NS_number": "74",
        "NS_image": "https://www.dropbox.com/scl/fi/cx0n7yh15het97evbn7ot/table74.png?rlkey=9h4uzvs6cvzdcqyjx4iaurvq8&raw=1",
        "number_to_search_for": 7,
        "difficulty": 1,
        "correct_answer": 1.0
    },
    {
        "": "75",
        "NS_number": "75",
        "NS_image": "https://www.dropbox.com/scl/fi/t2mgg9y9uznf0l661i00u/table75.png?rlkey=gozwbq02mttcjvdpwha3srwsq&raw=1",
        "number_to_search_for": 5,
        "difficulty": 2,
        "correct_answer": 3.0
    },
    {
        "": "76",
        "NS_number": "76",
        "NS_image": "https://www.dropbox.com/scl/fi/s7wuo673xjd0fiddyo29y/table76.png?rlkey=amt0owklgt3x5v7yzv4f53l3j&raw=1",
        "number_to_search_for": 2,
        "difficulty": 0,
        "correct_answer": 1.0
    },
    {
        "": "77",
        "NS_number": "77",
        "NS_image": "https://www.dropbox.com/scl/fi/xqd75zorgrsqr7mrpn4k6/table77.png?rlkey=0gnw41ssoahjriv4ip4olm4rx&raw=1",
        "number_to_search_for": 9,
        "difficulty": 2,
        "correct_answer": 5.0
    },
    {
        "": "78",
        "NS_number": "78",
        "NS_image": "https://www.dropbox.com/scl/fi/lcd66bwz518r3hqbj6ft8/table78.png?rlkey=v3bvmlpv1oulb23v5po9pflo8&raw=1",
        "number_to_search_for": 7,
        "difficulty": 2,
        "correct_answer": 6.0
    },
    {
        "": "79",
        "NS_number": "79",
        "NS_image": "https://www.dropbox.com/scl/fi/4mgrbeo0hzsx2oyvirtfu/table79.png?rlkey=0f9belmqs3sslwurf9aihdfc8&raw=1",
        "number_to_search_for": 3,
        "difficulty": 1,
        "correct_answer": 3.0
    },
    {
        "": "80",
        "NS_number": "80",
        "NS_image": "https://www.dropbox.com/scl/fi/dzoiovqb9pilx6wtay1y0/table80.png?rlkey=gve82i4j7obr3705t3ct31r69&raw=1",
        "number_to_search_for": 1,
        "difficulty": 2,
        "correct_answer": 4.0
    },
    {
        "": "81",
        "NS_number": "81",
        "NS_image": "https://www.dropbox.com/scl/fi/5l11oy1n93a3wzy5kl6ip/table81.png?rlkey=6ku0mdx54clwthlvvhnis2u5u&raw=1",
        "number_to_search_for": 4,
        "difficulty": 2,
        "correct_answer": 5.0
    },
    {
        "": "82",
        "NS_number": "82",
        "NS_image": "https://www.dropbox.com/scl/fi/yfmeq4527x8lxqcszr2bc/table82.png?rlkey=egrhni75aox1z4ia8f4lhj8q9&raw=1",
        "number_to_search_for": 1,
        "difficulty": 1,
        "correct_answer": 3.0
    },
    {
        "": "84",
        "NS_number": "84",
        "NS_image": "https://www.dropbox.com/scl/fi/c659su3zlsqh026oc4bj5/table84.png?rlkey=ubay9iib5lfyqw0p0dme0hqap&raw=1",
        "number_to_search_for": 5,
        "difficulty": 1,
        "correct_answer": 6.0
    },
    {
        "": "85",
        "NS_number": "85",
        "NS_image": "https://www.dropbox.com/scl/fi/c2hnb1rec48wnhrh7k9bo/table85.png?rlkey=b9qevygbqol1opd4xqa9z3can&raw=1",
        "number_to_search_for": 8,
        "difficulty": 2,
        "correct_answer": 8.0
    },
    {
        "": "86",
        "NS_number": "86",
        "NS_image": "https://www.dropbox.com/scl/fi/r1omqj5acjwje0edob3mg/table86.png?rlkey=ut9jdbil8e0rkhfkwca9i0lp7&raw=1",
        "number_to_search_for": 6,
        "difficulty": 2,
        "correct_answer": 4.0
    },
    {
        "": "87",
        "NS_number": "87",
        "NS_image": "https://www.dropbox.com/scl/fi/37qpyrv1lkz2at2nysr29/table87.png?rlkey=l2wz8v7unkhcjol8b60gvhjpi&raw=1",
        "number_to_search_for": 5,
        "difficulty": 1,
        "correct_answer": 4.0
    },
    {
        "": "89",
        "NS_number": "89",
        "NS_image": "https://www.dropbox.com/scl/fi/lqav9z85g22ws7yaiyrre/table89.png?rlkey=r48o9flo6zeg8lt3qjj2md0h9&raw=1",
        "number_to_search_for": 3,
        "difficulty": 1,
        "correct_answer": 2.0
    },
    {
        "": "90",
        "NS_number": "90",
        "NS_image": "https://www.dropbox.com/scl/fi/z5dgejkmtyhc3rlkzws3d/table90.png?rlkey=wcwhlnygcv1wzu92i8h1b2zwt&raw=1",
        "number_to_search_for": 3,
        "difficulty": 1,
        "correct_answer": 6.0
    },
    {
        "": "91",
        "NS_number": "91",
        "NS_image": "https://www.dropbox.com/scl/fi/e2p64ur9y6ipkrhhn5d8n/table91.png?rlkey=vs8bfqfi0zb5rsvg8afqtbi8o&raw=1",
        "number_to_search_for": 4,
        "difficulty": 1,
        "correct_answer": 3.0
    },
    {
        "": "92",
        "NS_number": "92",
        "NS_image": "https://www.dropbox.com/scl/fi/8eugztjwqz8137sfpzgye/table92.png?rlkey=nrszuqweg4q6ruoa2ug8gzet4&raw=1",
        "number_to_search_for": 7,
        "difficulty": 1,
        "correct_answer": 2.0
    },
    {
        "": "93",
        "NS_number": "93",
        "NS_image": "https://www.dropbox.com/scl/fi/i60imxwfexbk0gedyr0i7/table93.png?rlkey=7p6tulfdfv9v9tcqulacrjum9&raw=1",
        "number_to_search_for": 8,
        "difficulty": 2,
        "correct_answer": 6.0
    },
    {
        "": "94",
        "NS_number": "94",
        "NS_image": "https://www.dropbox.com/scl/fi/gs41i9xgpsdn67h88evkb/table94.png?rlkey=up1rnv3okso1b2goesjr6704l&raw=1",
        "number_to_search_for": 2,
        "difficulty": 0,
        "correct_answer": 1.0
    },
    {
        "": "95",
        "NS_number": "95",
        "NS_image": "https://www.dropbox.com/scl/fi/f2yz625ok48xl4pzggawq/table95.png?rlkey=5yc8gvsjx067wvt4hgx3g1544&raw=1",
        "number_to_search_for": 6,
        "difficulty": 1,
        "correct_answer": 1.0
    },
    {
        "": "96",
        "NS_number": "96",
        "NS_image": "https://www.dropbox.com/scl/fi/3ed1zbut8z3xdiwjzhty5/table96.png?rlkey=s9xezzxr570jt9nabi18w8nue&raw=1",
        "number_to_search_for": 2,
        "difficulty": 2,
        "correct_answer": 5.0
    },
    {
        "": "97",
        "NS_number": "97",
        "NS_image": "https://www.dropbox.com/scl/fi/ay0re83pe7qjugtfnm4ne/table97.png?rlkey=qmtqsfou6y2cnchql6qlb7une&raw=1",
        "number_to_search_for": 7,
        "difficulty": 2,
        "correct_answer": 8.0
    },
    {
        "": "98",
        "NS_number": "98",
        "NS_image": "https://www.dropbox.com/scl/fi/ycok33dd8mr4phmr3ix6k/table98.png?rlkey=w31tinv8tca4rc6ief34wrq5u&raw=1",
        "number_to_search_for": 5,
        "difficulty": 2,
        "correct_answer": 8.0
    },
    {
        "": "99",
        "NS_number": "99",
        "NS_image": "https://www.dropbox.com/scl/fi/lwu8vfl0vymg71bbo6xc5/table99.png?rlkey=1x8b3fpcawl4wrkvejyf6mvn6&raw=1",
        "number_to_search_for": 8,
        "difficulty": 2,
        "correct_answer": 4.0
    }
]

let timeline = {
    Day: 0,
    Shift: 0,
    Patient: 0,
}

let mainPatientList = [patient_json, formula_json]
let telemedicinePatientList = patient_json_t
let numberSearchPatientList = number_search_json
let queues = {
    "Main": [],
    "Telemedicine": [],
    "NumberSearch": [],
    "DayBreak": [],
}
let currentPatient = null
let currentJob = "Main"

function startBreakTimer(duration, callback) {
    let timer = duration, minutes, seconds;
    let callbackShown = false
    breakTimerInterval = setInterval(function () {
        minutes = parseInt(Math.abs(timer) / 60, 10);
        seconds = parseInt(Math.abs(timer) % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        
        
        if (currentJob == "DayBreak") {
            //put the random pop ins here
            if (minutes == 0 && seconds == 20 && GameConfig.SurpriseVisits[timeline.Day] && !inDiagnosis && !callbackShown) {
                surpriseVisit()
            }
        }
        if (--timer < 0) {
            if (!callbackShown && !(queues[currentJob].length > 0 && inDiagnosis)) {
                callbackShown = true
                timer += 5
                callback();
            }
            document.getElementById('break-timer').textContent = "Break over! You are " + minutes + ":" + seconds + " late";
            breakTimerStatus = "late " + minutes + ":" + seconds
            totalSecondsLate += 1
        } else {
            document.getElementById('break-timer').textContent = "Break: " + minutes + ":" + seconds;
            breakTimerStatus = minutes + ":" + seconds
        }
    }, 1000);
}

function stopBreakTimer() {
    clearInterval(breakTimerInterval);
    document.getElementById('break-timer').textContent = ''; // Clear timer text
    breakTimerStatus = ""
}

function startMainJobTimer(duration) {
    let timer = duration, minutes, seconds;
    jobTimerInterval = setInterval(function () {
        minutes = parseInt(Math.abs(timer) / 60, 10);
        seconds = parseInt(Math.abs(timer) % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        
        if (--timer < 0) {
            if (queues[currentJob].length > 0 && inDiagnosis) {
                //overtime!!
                document.getElementById('break-timer').textContent = "You are going overtime and losing break time! You are " + minutes + ":" + seconds + " late";
                mainJobTimerStatus = "late " + minutes + ":" + seconds
                mainJobSecondsLate += 1
            }
        } else {
            document.getElementById('break-timer').textContent = "Main Job: " + minutes + ":" + seconds;
            mainJobTimerStatus = minutes + ":" + seconds
        }
    }, 1000);
}

function stopMainJobTimer() {
    clearInterval(jobTimerInterval);
    document.getElementById('break-timer').textContent = ''; // Clear timer text
    mainJobTimerStatus = ""
}

function startTimer() {
    let startTime = Date.now();
    timerInterval = setInterval(function() {
        let elapsedTime = Date.now() - startTime;
        let seconds = Math.floor(elapsedTime / 1000);
        let minutes = Math.floor(seconds / 60);
        seconds = seconds % 60; // Remainder gives seconds past the last full minute
        document.getElementById('timer').textContent = 'Time: ' +
            (minutes < 10 ? '0' : '') + minutes + ':' +
            (seconds < 10 ? '0' : '') + seconds;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function surpriseVisit() {
    document.getElementById('scene-title').textContent = "Incoming call!"
    document.getElementById('scene-story').textContent = "A patient is calling to ask for a diagnosis. You may 1) choose to give a diagnosis without pay   or  2) do nothing. What will you do?"
    let choicesContainer = document.getElementById('choices');
    choicesContainer.innerHTML = ''; // Clear previous choices
    let btn = document.createElement('button');
    btn.textContent = "Answer";
    btn.onclick = () => {
        scored = false
        clearQueues()
        queuePatients()
        nextPatient()
    };
    choicesContainer.appendChild(btn);
	btn = document.createElement('button');
    btn.textContent = "Ignore";
    btn.onclick = () => {
		breakRoom()
    };
    choicesContainer.appendChild(btn);
}

//use this function to add patients to the queues.
let mainDiagnosisCounter = 0
let mainFormulaCounter = 0
let telemedicinePatientCounter = 0
let numberSearchPatientCounter = 0

function queuePatients() {
    if (currentJob == "Main") {
        //main job
        for (let i=0; i<GameConfig.MainJob[timeline.Day][timeline.Shift]; i++) {
            if ((mainFormulaCounter + mainDiagnosisCounter) % 3 == 2) {
                let patient = mainPatientList[1][mainFormulaCounter]
                patient.type = "formula"
                queues[currentJob].push(patient)
                mainFormulaCounter += 1
            } else {
                let patient = mainPatientList[0][mainDiagnosisCounter]
                patient.type = "diagnosis"
                queues[currentJob].push(patient)
                mainDiagnosisCounter += 1
            }
        }
    } else if (currentJob == "Telemedicine") {
        //side job
        for (let i=0; i<GameConfig.Telemedicine[timeline.Day][timeline.Shift]; i++) {
            let patient = telemedicinePatientList[telemedicinePatientCounter]
            patient.type = "diagnosis"
            queues[currentJob].push(patient)
            telemedicinePatientCounter += 1
        }
    } else if (currentJob == "NumberSearch") {
        for (let i=0; i<GameConfig.NumberSearch[timeline.Day][timeline.Shift]; i++) {
            let patient = numberSearchPatientList[numberSearchPatientCounter]
            patient.type = "numberSearch"
            queues[currentJob].push(patient)
            numberSearchPatientCounter += 1
        }
    } else {
        //surprise visits
        queues[currentJob].push(mainPatientList[0][mainDiagnosisCounter])
        mainDiagnosisCounter += 1
    }
}

function clearQueues() {
    for (const key in queues) {
        queues[key] = []
    }
}

function nextPatient() {
    if (queues[currentJob].length == 0) {
        //if queues becomes empty, start a break
        if (currentJob == "Main") {
            startBreak()
        } else {
            breakRoom()
        }
        return
    }
    inDiagnosis = true
    currentPatient = queues[currentJob][0]
    if (currentPatient.type == "formula") {
        sliderPatient()
    } else if (currentPatient.type == "numberSearch") {
        numberSearchPatient()
    } else {
        diagnosePatient()
    }
}

function numberSearchPatient() {
    document.getElementById('scene-title').textContent = "Number Search " + currentPatient["NS_number"];
    document.getElementById('scene-story').textContent = "How many " + currentPatient["number_to_search_for"] + "'s do you see?";
    
    document.getElementById('number_img').src = currentPatient["NS_image"]
    document.getElementById('number-container').classList.remove("hidden")
    document.getElementById('patients-left').classList.remove("hidden")
    document.getElementById('patients-left').textContent = "Patients left: " + queues[currentJob].length

    let input = document.getElementById("imageInput")
    let container = document.getElementById('choices');
    container.innerHTML = ''; // Clear previous choices

    let submitBtn = document.createElement('button');
    submitBtn.textContent = 'Submit Answer';
    submitBtn.onclick = function() {
        if (parseFloat(input.value) == currentPatient["correct_answer"]) {
            correct()
        } else {
            wrong()
        }
    };
    container.appendChild(submitBtn);
    //add option to skip or switch back to leisure if it is telemedicine
    if (currentJob == "NumberSearch") {
        let btn = document.createElement('button');
        btn.textContent = "Skip";
        btn.onclick = () => {
            skipPatient()
        };
        container.appendChild(btn);

        btn = document.createElement('button');
        btn.textContent = "Back to Break";
        btn.onclick = () => {
            breakRoom()
        };
        container.appendChild(btn);
    }
    document.getElementById('game-view').classList.remove('hidden');
    document.getElementById('start-button').classList.add('hidden');
}

function sliderPatient() {
    document.getElementById('formula-container').classList.remove('hidden');
    document.getElementById('scene-title').textContent = "Patient " + currentPatient["patient #"];
    document.getElementById('scene-story').textContent = "Calculate the optimal dosage for the patient. The formula is as follows:  " + currentPatient["formula"] + ", where a=" + currentPatient["a"] + ", b=" + currentPatient["b"];
    document.getElementById('patients-left').classList.remove("hidden")
    document.getElementById('patients-left').textContent = "Patients left: " + queues[currentJob].length
    let answeredValue = false
    let answerInput = document.getElementById('formulaInput');
    answerInput.disabled = false
    let slider = document.getElementById('myRange');
    let output = document.getElementById('value');
    slider.min = 0; // Set minimum value
    slider.max = 10; // Maximum can be adjusted as needed
    slider.value = 0; // Start at 0
    slider.step = 0.25
    output.textContent = slider.value; // Display initial value

    slider.oninput = function() {
        output.textContent = this.value; // Update the displayed value
        let percentage = ((this.value - this.min) / (this.max - this.min)) * 100;
        this.style.background = `linear-gradient(90deg, #14284b ${percentage}%, #BCBCBC ${percentage}%)`;
    };

    let container = document.getElementById('choices');
    container.innerHTML = ''; // Clear previous choices

    let submitBtn = document.createElement('button');
    submitBtn.textContent = 'Submit Answer';
    submitBtn.onclick = function() {
        if (answeredValue) {
            if ((parseFloat(slider.value) - currentPatient["corr_answer"] >= -0.5) && (parseFloat(slider.value) - currentPatient["corr_answer"] <= 0.5)) {
                correct()
            } else {
                wrong()
            }
        } else {
            if ((parseFloat(answerInput.value) - currentPatient["corr_answer"]  >= -0.5 ) && (parseFloat(answerInput.value) - currentPatient["corr_answer"]  <= 0.5)) {
                answeredValue = true
                answerInput.disabled = true
                document.getElementById('slider-container').classList.remove('hidden');
            } else {
                wrong()
            }
        }
    };
    container.appendChild(submitBtn);
}
function diagnosePatient() {
    //
    let symptoms = []
    symptoms = currentPatient["symptoms"]
    let symptomsStr = symptoms.join(", ")
    document.getElementById('scene-title').textContent = "Patient " + currentPatient["patient #"];
    document.getElementById('scene-story').textContent = "This patient is experiencing the symptoms: " + symptomsStr + ". What is your diagnosis?";
    document.getElementById('patients-left').classList.remove("hidden")
    document.getElementById('patients-left').textContent = "Patients left: " + queues[currentJob].length
    //add choices
    let choicesContainer = document.getElementById('choices');
    choicesContainer.innerHTML = ''; // Clear previous choices
    for (const element in chart) {
        let btn = document.createElement('button');
        btn.textContent = element;
        btn.onclick = () => {
            if (element == currentPatient["corr diagnosis"]) {
                correct()
            } else {
                wrong()
            }
        };
        choicesContainer.appendChild(btn);
    };
    
    //add option to skip or switch back to leisure if it is telemedicine
    if (currentJob == "Telemedicine") {
        let btn = document.createElement('button');
        btn.textContent = "Skip";
        btn.onclick = () => {
            skipPatient()
        };
        choicesContainer.appendChild(btn);

        btn = document.createElement('button');
        btn.textContent = "Back to Break";
        btn.onclick = () => {
            breakRoom()
        };
        choicesContainer.appendChild(btn);
    }
    document.getElementById('game-view').classList.remove('hidden');
    document.getElementById('start-button').classList.add('hidden');
}

function correct() {
    tasksCompleted += 1;
    document.getElementById('patient-counter').textContent = "Tasks Completed: " + tasksCompleted
    if (currentJob == "Main") {
        mainJobCount += 1
		    if (scored) {
        mscore += 1
    }
    } else if (currentJob == "Telemedicine") {
        telemedicineCount += 1
		    if (scored) {
        sscore += 1
    }
    } else if (currentJob == "NumberSearch") {
        numberSearchCount += 1
		    if (scored) {
        sscore += 2
    }
    } else if (currentJob == "DayBreak") {
        surpriseVisitCount += 1
    }
    score = sscore + mscore
    timeline.Patient += 1
    document.getElementById('score').textContent = 'Score: ' + score;
    document.getElementById('scene-title').textContent = "Correct! You gain a point";
    if (currentPatient.type == "formula") {
        document.getElementById('scene-story').textContent = "The correct value is " + currentPatient["corr_answer"] + ".";
        document.getElementById('formula-container').classList.add('hidden');
        document.getElementById('slider-container').classList.add('hidden'); // Hide slider after submission
    } else if (currentPatient.type == "numberSearch") {
        document.getElementById('scene-story').textContent = "The correct amount of " + currentPatient["number_to_search_for"] + "'s is " + currentPatient["correct_answer"] + ".";
        document.getElementById('number-container').classList.add('hidden');
    } else {
        document.getElementById('scene-story').textContent = "This patient exhibits symptoms for " + currentPatient["corr diagnosis"] + ". What would you like to next?"
    }
    
    let choicesContainer = document.getElementById('choices');
    choicesContainer.innerHTML = ''; // Clear previous choices

    let btn = document.createElement('button');
    btn.textContent = "Next";
    btn.onclick = () => {
        queues[currentJob] = queues[currentJob].slice(1)
        nextPatient()
    };
    choicesContainer.appendChild(btn);
}

function wrong() {
    tasksCompleted += 1;
    document.getElementById('patient-counter').textContent = "Tasks Completed: " + tasksCompleted
    if (currentJob == "Main") {
        mainJobCount += 1
		if (scored) {
        mscore -= 0.5
    }
    } else if (currentJob == "Telemedicine") {
        telemedicineCount += 1
		    if (scored) {
        sscore -= 0.5
    }
    } else if (currentJob == "NumberSearch") {
        numberSearchCount += 1
		if (scored) {
        sscore -= 1
    }
    } else if (currentJob == "DayBreak") {
        surpriseVisitCount += 1
    }
    timeline.Patient += 1
	score = mscore + sscore
    document.getElementById('score').textContent = 'Score: ' + score;
    document.getElementById('scene-title').textContent = "Incorrect! You lose half a point";
    if (currentPatient.type == "formula") {
        document.getElementById('scene-story').textContent = "Incorrect! The correct value is " + currentPatient["corr_answer"] + ".";
        document.getElementById('formula-container').classList.add('hidden');
        document.getElementById('slider-container').classList.add('hidden'); // Hide slider after submission
    } else if (currentPatient.type == "numberSearch") {
        document.getElementById('scene-story').textContent = "Incorrect! The correct amount of " + currentPatient["number_to_search_for"] + "'s is " + currentPatient["correct_answer"] + ".";
        document.getElementById('number-container').classList.add('hidden');
    } else {
        document.getElementById('scene-story').textContent = "Incorrect! This patient exhibits symptoms for " + currentPatient["corr diagnosis"] + ". What would you like to next?"
    }
    let choicesContainer = document.getElementById('choices');
    choicesContainer.innerHTML = ''; // Clear previous choices

    let btn = document.createElement('button');
    btn.textContent = "Next";
    btn.onclick = () => {
        queues[currentJob] = queues[currentJob].slice(1)
        nextPatient()
    };
    choicesContainer.appendChild(btn);
}

function skipPatient() {
    //put any other functionality we may want to add for skipping here (like showing text)
    queues[currentJob] = queues[currentJob].slice(1)
    timeline.Patient += 1
    //diagnose the next patient
    nextPatient()
}

function startMainJob() {
    scored = true
    clearQueues()
    currentJob = "Main"
    queuePatients()
    startMainJobTimer(GameConfig.MainJobTimer[timeline.Day][timeline.Shift])
    nextPatient()
}

function startTelemedicine() {
    scored = true
    currentJob = "Telemedicine"
    queuePatients()
    //do not diagnose beacuse user needs to opt in
}

function startNumberSearch() {
    scored = true
    currentJob = "NumberSearch"
    queuePatients()
}

function startBreak() {
    inDiagnosis = false
    timeline.Patient = 0
    timeline.Shift += 1;
    stopMainJobTimer()
    if (timeline.Shift >= GameConfig.MainJob[timeline.Day].length) {
        //end of day
        endDay()
        return
    }
    
    startBreakTimer(Math.max(GameConfig.BreakLength-mainJobSecondsLate, 0), endBreak)
    mainJobSecondsLate = 0
    clearQueues()
    //queues patients for telemedicine and number search
    startTelemedicine()
    startNumberSearch()
    breakRoom()
}

function endDay() {
    timeline.Shift = 0
    currentJob = "DayBreak"
    startBreakTimer(GameConfig.DayBreakLength-mainJobSecondsLate, endDayBreak)
    mainJobSecondsLate = 0
    breakRoom()
}

function breakRoom() {
    inDiagnosis = false
    document.getElementById('patients-left').classList.add("hidden")
    document.getElementById('number-container').classList.add('hidden');
    if (currentJob == "DayBreak") {
        document.getElementById('scene-title').textContent = "Breakroom"
        document.getElementById('scene-story').textContent = "You've finished your shifts for the day! Take a break"
        let choicesContainer = document.getElementById('choices');
        choicesContainer.innerHTML = ''; // Clear previous choices
    } else {
        if (timeline.Patient >= GameConfig.Telemedicine[timeline.Day][timeline.Shift]) {
            timeline.Patient = 0;
            document.getElementById('scene-title').textContent = "Breakroom"
            document.getElementById('scene-story').textContent = "You've finished avaliable tasks. Sit tight and enjoy yourself until your break is over!"
            let choicesContainer = document.getElementById('choices');
            choicesContainer.innerHTML = ''; // Clear previous choices
        } else {
            document.getElementById('scene-title').textContent = "Breakroom"
            document.getElementById('scene-story').textContent = "You're back in the breakroom. You have two options: 1) Enjoy yourself      2) Work on number searches until your next rotation"
            let choicesContainer = document.getElementById('choices');
            choicesContainer.innerHTML = ''; // Clear previous choices

            let btn = document.createElement('button');
            btn.textContent = "Work on Telemedicine";
            btn.onclick = () => {
                currentJob = "Telemedicine"
                nextPatient()
            };
            choicesContainer.appendChild(btn);
            /*btn = document.createElement('button');
            btn.textContent = "Work on Number Search";
            btn.onclick = () => {
                currentJob = "NumberSearch"
                nextPatient()
            };
            choicesContainer.appendChild(btn);*/
        }
    }
}

function endDayBreak() {
    timeline.Day += 1
    playerActions = ""
    document.getElementById('day').textContent = "Day: " + (timeline.Day + 1)
    cumulativeDayStats.push({
        "Score": score,
		"Score from Main Job": mscore,
		"Score from Side Job": sscore,
        "Tasks Completed": tasksCompleted,
        "Telemedicine visits": telemedicineCount,
        "Seconds late": totalSecondsLate,
    })
    document.getElementById('scene-title').textContent = "Day over!"
    document.getElementById('scene-story').textContent = "Your day is over. Here is a summary: "
    let summaryContainer = document.getElementById("summary-container")
    summaryContainer.innerHTML = '';
    let lastIndex = cumulativeDayStats.length - 1
    for (const stat in cumulativeDayStats[lastIndex]) {
        let summary = document.createElement('p')
        if (cumulativeDayStats.length == 1) {
            //first day
            summary.textContent = stat + ": " + cumulativeDayStats[lastIndex][stat]
        } else {
            //second or later day
            summary.textContent = stat + ": " + (cumulativeDayStats[lastIndex][stat] - cumulativeDayStats[lastIndex - 1][stat])
        }
        summaryContainer.appendChild(summary)
	}
    document.getElementById('patient-counter').classList.add('hidden');
	document.getElementById('linebreak').classList.add('hidden');
    document.getElementById('summary-container').classList.remove("hidden")
    let choicesContainer = document.getElementById('choices');
    choicesContainer.innerHTML = ''; // Clear previous choices

    let btn = document.createElement('button');
    btn.textContent = "Next";
    btn.onclick = () => {
        stopBreakTimer()
        document.getElementById('summary-container').classList.add("hidden")
		document.getElementById('patient-counter').classList.remove('hidden');
		document.getElementById('linebreak').classList.remove('hidden');
        if (timeline.Day >= GameConfig.MainJob.length) {
            //end of game
            gameOver()
            Q.enableNextButton()
            return
        }
        startMainJob()
    };
    choicesContainer.appendChild(btn);
}

function endBreak() {
    document.getElementById('number-container').classList.add('hidden');
    document.getElementById('scene-title').textContent = "Break over"
    document.getElementById('scene-story').textContent = "Your break is over. Time to get back to work!"
    let choicesContainer = document.getElementById('choices');
    choicesContainer.innerHTML = ''; // Clear previous choices

    let btn = document.createElement('button');
    btn.textContent = "Next";
    btn.onclick = () => {
        stopBreakTimer()
        startMainJob()
    };
    choicesContainer.appendChild(btn);
}

document.getElementById('start-button').addEventListener('click', startGame)
function startGame() {
    console.log('Starting game...');
    score = 0; // Reset score if restarting
    document.getElementById('start-button').classList.add('hidden')
    document.getElementById('score').textContent = 'Score: 0'; // Reset score display
    document.getElementById('scene-title').textContent = "Introduction"
    document.getElementById('scene-story').textContent = "Good Morning! Lets begin your shift"
    document.getElementById('disease-chart').classList.remove('hidden')
    document.getElementById('game-view').classList.remove('hidden');
    let choicesContainer = document.getElementById('choices');
    choicesContainer.innerHTML = ''; // Clear previous choices

    let btn = document.createElement('button');
    btn.textContent = "Start";
    btn.onclick = () => {
        document.getElementById('disease-chart').classList.add('hidden')
		document.getElementById('intro-text').classList.add('hidden')
		document.getElementById('disease-chart2').classList.remove('hidden')
        startMainJob()
    };
    choicesContainer.appendChild(btn);
    startTimer(); // Ensure the timer starts fresh with the game
};

// When implementing game over or restart:
function gameOver() {
    stopTimer(); // Stop the timer when the game breaks or ends
    storeGameData();
    document.getElementById('game-view').classList.add('hidden');
    document.getElementById('game-over').classList.remove('hidden');
};

document.addEventListener('click', function(event) {
    if (event.target.tagName === 'BUTTON') {
        // logging player actions
        playerActions += document.getElementById('timer').textContent.slice(6) + " "
        playerActions += event.target.textContent + " "
        playerActions += currentJob + " "
        playerActions += timeline.Day + " "
        playerActions += timeline.Shift + " "
        playerActions += timeline.Patient + " "
        playerActions += score + " "
		playerActions += mscore + " "
		playerActions += sscore + " "
        playerActions += breakTimerStatus + " "
        playerActions += ";"
        //add anymore information we want to obtain here

        
        switch (timeline.Day) {
            case 0:
                playerActions1 = playerActions
                break;
            case 1:
                playerActions2 = playerActions
                break;
            case 2:
                playerActions3 = playerActions
                break;
            case 3:
                playerActions4 = playerActions
                break;
            case 4:
                playerActions5 = playerActions
                break;
            case 5:
                playerActions6 = playerActions
                break;
            case 6:
                playerActions7 = playerActions
                break;
            case 7:
                playerActions8 = playerActions
                break;
            case 8:
                playerActions9 = playerActions
                break;
            default:
                //do nothing
                break;
        }
        
    }
});

function storeGameData() {
    /*Qualtrics.SurveyEngine.setEmbeddedData('gameDuration', document.getElementById('timer').textContent);
    Qualtrics.SurveyEngine.setEmbeddedData('finalScore', score);
    Qualtrics.SurveyEngine.setEmbeddedData('telemedicineSessions', telemedicineCount);
    Qualtrics.SurveyEngine.setEmbeddedData('numberSearchSessions', numberSearchCount);
    Qualtrics.SurveyEngine.setEmbeddedData('surpriseVisits', surpriseVisitCount);
    Qualtrics.SurveyEngine.setEmbeddedData('totalSecondsLate', totalSecondsLate);
	Qualtrics.SurveyEngine.setEmbeddedData('mainJobSecondsLate', mainJobSecondsLate);
    Qualtrics.SurveyEngine.setEmbeddedData('playerActions1', playerActions1);
    Qualtrics.SurveyEngine.setEmbeddedData('playerActions2', playerActions2);
    Qualtrics.SurveyEngine.setEmbeddedData('playerActions3', playerActions3);
    Qualtrics.SurveyEngine.setEmbeddedData('playerActions4', playerActions4);
    Qualtrics.SurveyEngine.setEmbeddedData('playerActions5', playerActions5);
    Qualtrics.SurveyEngine.setEmbeddedData('playerActions6', playerActions6);
    Qualtrics.SurveyEngine.setEmbeddedData('playerActions7', playerActions7);
    Qualtrics.SurveyEngine.setEmbeddedData('playerActions8', playerActions8);
    Qualtrics.SurveyEngine.setEmbeddedData('playerActions9', playerActions9);*/
    
}

    /* hideEl(element) {
        element.hide();
    }   
	
    var nb = $('NextButton');
	const regex = /^{"T":.*?"A":.*?]}$/;
    hideEl.defer(nb);
    $(this.questionId).down('.InputText').on('keyup', function(event) {
        if (regex.test(this.value)) nb.show();
        else nb.hide();
    });
});*/