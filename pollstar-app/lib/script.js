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

       var  surveyId = surveyData.foundationId + surveyData.surveyNum;

       var survey = factory.newResource(NS,'Survey',surveyId);
       survey.numOfQuestion = surveyData.numOfQuestion;
       survey.voterIds = [];
       
       // Elements of the question concept is filled to add survey model
       var num;
       var length = surveyData.numOfQuestion;
       let arr = [];
       
       for(num = 0; num < length; num++ )
       {    
           var question = factory.newConcept(NS,'Question');       
           question.questionText = surveyData.questionArr[num].questionText;
           question.optionA = surveyData.questionArr[num].optionA;
           question.optionB = surveyData.questionArr[num].optionB;
           question.optionC = surveyData.questionArr[num].optionC;
           question.optionD = surveyData.questionArr[num].optionD;
           question.optionE = surveyData.questionArr[num].optionE;
           question.votedA = 0;
           question.votedB = 0;
           question.votedC = 0;
           question.votedD = 0;
           question.votedE = 0;
           arr[num] = question;
       }   
       survey.questions = arr;
       
       var event = factory.newEvent(NS, 'surveyCreated');
       event.surveyId = surveyId;
       emit(event);

           // 4. Add to registry
       return surveyRegistry.add(survey);
   });
}

/**
* Create Participant Transaction
* @param {org.pollstar.participant.createFoundation} createFoundation
* @transaction
*/

function createFoundation(foundationData){
   return getParticipantRegistry('org.pollstar.participant.Foundation')
   .then(function(foundationRegistry){
       var  factory = getFactory();
       return query('getFoundation',{username:foundationData.userName})
                   .then(function (results) 
       {
           
       
           if(results.length == 0)
           {
               var  NS =  'org.pollstar.participant';
               var participantId = "";
               participantId = foundationData.userName;
               var foundation = factory.newResource(NS,'Foundation',participantId);
               var signupValues = factory.newConcept(NS,'SignupValues');
               signupValues.userName = foundationData.userName;
               signupValues.password = foundationData.password;
               signupValues.email = foundationData.email;
               foundation.signupValues = signupValues;
               var info = factory.newConcept(NS,'Info');
               info.adress = foundationData.adress;
               foundation.type = 0;
               foundation.Description = foundationData.Description;
               var event = factory.newEvent(NS, 'foundationCreated');
               event.participantId = participantId;
               emit(event);
               return foundationRegistry.add(foundation);
           }
           else{
               throw new Error ("Username already exists for foundation!");
           }
       });
    });
}
/**
* Create Participant Transaction
* @param {org.pollstar.participant.createAdmin} createAdmin
* @transaction
*/

function createAdmin(adminData){
    return getParticipantRegistry('org.pollstar.participant.Admin')
    .then(function(adminRegistry){
        var  factory = getFactory();
        return query('getFoundation',{username:adminData.userName})
                    .then(function (results) 
        {
            
        
            if(results.length == 0)
            {
                var  NS =  'org.pollstar.participant';
                var participantId = "";
                participantId = adminData.userName;
                var admin = factory.newResource(NS,'Admin',participantId);
                var signupValues = factory.newConcept(NS,'SignupValues');
                signupValues.userName = adminData.userName;
                signupValues.password = adminData.password;
                signupValues.email = adminData.email;
                admin.signupValues = signupValues;
                var info = factory.newConcept(NS,'Info');
                info.adress = adminData.adress;
                admin.type = 1;
                admin.Description = adminData.Description;
                var event = factory.newEvent(NS, 'adminCreated');
                event.participantId = participantId;
                emit(event);
                return adminRegistry.add(admin);
            }
            else{
                throw new Error ("Username already exists for admin!");
            }
        });
    });
 }
/**
* Create Voter Transaction
* @param {org.pollstar.participant.createVoter} createVoter
* @transaction
*/

function createVoter(voterData){
    return getParticipantRegistry('org.pollstar.participant.Voter')
    .then(function(voterRegistry){
        var  factory = getFactory();
        return query('getFoundation',{username:voterData.userName})
                    .then(function (results) 
        {
            
        
            if(results.length == 0)
            {
                var  NS =  'org.pollstar.participant';
                var participantId = "";
                participantId = voterData.userName;
                var voter = factory.newResource(NS,'Voter',participantId);
                var signupValues = factory.newConcept(NS,'SignupValues');
                signupValues.userName = voterData.userName;
                signupValues.password = voterData.password;
                signupValues.email = voterData.email;
                voter.signupValues = signupValues;
                var info = factory.newConcept(NS,'Info');
                info.adress = voterData.adress;
                voter.type = 2;
                voter.Description = voterData.Description;
                var event = factory.newEvent(NS, 'voterCreated');
                event.participantId = participantId;
                emit(event);
                return voterRegistry.add(voter);
            }
            else{
                throw new Error ("Username already exists for voter!");
            }
        });
    });
 }
/*import { emit } from "cluster";

/*
* A script is written to define transactions in the blockchain
* Used preimplemented set of functions to define transaction functions
* Fabric Composer API *
*/
/*
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
}*/
