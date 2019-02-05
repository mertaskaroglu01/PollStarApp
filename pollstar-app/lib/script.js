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
        return query('getAdmin',{username:adminData.userName})
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
        return query('getVoter',{username:voterData.userName})
                    .then(function (results) 
        {
            
        
            if(results.length == 0)
            {
                var  NS =  'org.pollstar.participant';
                var participantId = "";
                participantId = voterData.userName;
                var voter = factory.newResource(NS,'Voter',participantId);
                voter.coin = 0;
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

 /**
* Assigns Survey to Participant
* @param {org.pollstar.survey.assignSurvey} assignData
* @transaction
*/
function  assignSurvey(assignData){
    var surveyRegistry={}
    return getAssetRegistry('org.pollstar.survey.Survey').then(function(registry){
        surveyRegistry = registry
        return surveyRegistry.get(assignData.surveyId);
    }).then(function(survey){
        if(!survey) throw new Error("Survey : "+assignData.surveyId," Not Found!!!");
        survey.voterIds.push(assignData.participantId);
        return surveyRegistry.update(survey);
    }).then(function(){
        // Successful update
        var event = getFactory().newEvent('org.pollstar.survey', 'surveyAssigned');
        event.surveyId = assignData.surveyId;
        event.participantId = assignData.participantId;
        emit(event);
    }).catch(function(error){
        throw new Error(error);
    });
}

/**
* Assigns Survey to Participant
* @param {org.pollstar.survey.voteQuestion} voteData
* @transaction
*/
function voteQuestion(voteData){
    var surveyReg = {};
    return getAssetRegistry('org.pollstar.survey.Survey').then(function(registry){
        surveyReg = registry
        return surveyReg.get(voteData.surveyId);
    }).then(function(survey){
        if(!survey) throw new Error("Survey : "+voteData.surveyId," Not Found!!!");
        if(votedData.votedOption == "A" )
        {
            survey.questions[voteData.questionIndex].votedA++;
        }
        
        else if(votedData.votedOption == "B" )
        {
            survey.questions[voteData.questionIndex].votedB++;
        }

        else if(votedData.votedOption == "C" )
        {
            survey.questions[voteData.questionIndex].votedC++;
        }

        else if(votedData.votedOption == "D" )
        {
            survey.questions[voteData.questionIndex].votedD++;
        }

        else if(votedData.votedOption == "E" )
        {
            survey.questions[voteData.questionIndex].votedE++;
        }
        
        return surveyReg.update(survey);

    }).then(function(){
        // Successful update
        var event = getFactory().newEvent('org.pollstar.survey', 'questionVoted');
        event.surveyId = voteData.surveyId;
        emit(event);
    }).catch(function(error){
        throw new Error(error);
    });

}

