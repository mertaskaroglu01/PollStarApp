/**
 * Create Participant Transaction
 * @param {org.pollstar.survey.createSurvey} surveyData
 * @transaction
 * 
 * 1. Check for the validity of the schedule - throw error 
 * 2. Create the Flight asset
 *    2.1 Set the flightId, flightNumber
 *    2.2 Create an instance of the 'route' Concept
 *    2.3 Set the data on 'route' Concept
 *    2.4 Set the flight asset route = 'route' concept
 * 3. Emit FlightCreated Event
 * 4. Add the flight asset to the registry
 */
 
 function createSurvey(surveyData)
 {
    return getAssetRegistry('org.pollstar.survey.Survey')
    .then(function(surveyRegistry){
        
        var  factory = getFactory();

        var  NS =  'org.pollstar.survey';

        var  surveyId = generateSurveyId();
        var survey = factory.newResource(NS,'Survey',surveyId);
        survey.numOfQuestion = surveyData.numOfQuestion;
        survey.voterIds = [];
        var question = factory.newConcept(NS,'Question');
        // Elements of the question concept is filled to add survey model
        var num;
        var length = surveyData.numOfQuestion;
        let arr = [];
        for(num = 0; num < length; num++ )
        {           
            question.questionText = surveyData.questionText;
            question.optionA = surveyData.newA;
            question.optionB = surveyData.newB;
            question.optionC = surveyData.newC;
            question.optionD = surveyData.newD;
            question.optionE = surveyData.newE;
            question.votedA = 0;
            question.votedB = 0;
            question.votedC = 0;
            question.votedD = 0;
            question.votedE = 0;
            arr[num] = question;
        }   
        survey.questions = arr;
        var route = factory.newConcept(NS,"Route");
    });
}

import { emit } from "cluster";

/*
* A script is written to define transactions in the blockchain
* Used preimplemented set of functions to define transaction functions
* Fabric Composer API *
*/
function assignSurvey(SurveyParticipantData){
    var surveyRegistry = {}
    return getAssetRegistry("org.pollstar.survey.Survey").then(function(registry){
        surveyRegistry = registry;
        return surveyRegistry.get(SurveyParticipantData.surveyId);
    }).then(function(survey){
        if(!survey){
            throw new Error("Survey: " + surveyId + " not found");
            var factory = getFactory();
            var relationship = factory.newRelationship("org.pollstar.survey", "Survey", SurveyParticipantData.participantId);
            survey.participant = relationship;
            return surveyRegistry.update(participant);
        }
    }).then(function(){
        //Successful update 
        var event = getFactory().newEvent("org.pollstar.survey", "survey assigned");
        event.participantId = SurveyParticipantData.participantId;
        emit(event);
    }).catch(function(error){
        throw new Error(error);
    });
}