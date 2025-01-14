

### Revised Game Concept: PokeFake

Objective:  
Players compete against each other and a knowledgeable AI to correctly identify AI-generated versus human-created images or videos. The goal is to accumulate the most points by making accurate detections, strategically betting, and outperforming the AI opponent.

### Core Components

1. Players:

- Human Players: 2-6 participants.

- AI Opponent: An AI system with full knowledge of the content's origin (AI-generated or human-created).
    
3. Game Elements:

- Content Cards: Each card contains either an AI-generated or human-created image/video snippet.
    
- Detection Tokens: Used by players to mark their guesses ("AI" or "Human").
    
- Betting Chips: Represent in-game currency for strategic betting, similar to poker.
    

5. Rounds:
    

- The game consists of multiple rounds, each involving content presentation, betting, and detection phases.
    

### Game Mechanics

1. Setup:
    

- Each human player starts with an equal number of betting chips (e.g., 100 chips).
    
- The AI is assigned a virtual stack of chips based on its difficulty level (e.g., 100 chips).
    

3. Dealing Content:
    

- At the start of each round, a Content Card is drawn and presented to all players, including the AI.
    
- The content is randomly selected to be either AI-generated or human-created.
    

5. Phases of Each Round:  
    a. Inspection Phase:
    

- Players have a limited time (e.g., 30 seconds) to view and analyse the content.
    
- The AI processes the content instantly, using its full knowledge to determine its origin.
    

7. b. Betting Phase:
    

- Human Players:
    

- Decide how many chips to bet on their confidence in detecting the content's origin.
    
- Betting options can include raising, calling, or folding based on their confidence.
    

- AI Opponent:
    

- Uses its knowledge to make strategic bets.
    
- The AI can bet aggressively when it’s confident, or conservatively to mimic human-like uncertainty.
    

9. c. Detection Phase:
    

- Human Players:
    

- Declare their guess using Detection Tokens ("AI" or "Human").
    

- AI Opponent:
    

- To simulate imperfect AI, we can introduce a configurable accuracy rate where the AI can sometimes make incorrect guesses.
    

11. Resolution:
    

- Reveal the true nature of the Content Card.
    
- Scoring:
    

- Correct Guess:
    

- Players gain points equal to their bet.
    

- Incorrect Guess:
    

- Players lose points equal to their bet.
    

- AI Performance:
    

- The AI's performance is tracked similarly, allowing comparison between human and AI accuracy.
    
- If the AI is configured to have imperfect accuracy, adjust its points accordingly.
    

13. Progression:
    

- The game continues for a predetermined number of rounds or until a player reaches a target score.
    
- Leaderboards display top performers, highlighting humans who outperform the AI.
    

### Adjustments Based on AI’s Knowledge

1. AI Betting Strategy:
    

- Perfect Knowledge Mode:
    

- The AI always knows the correct origin and can bet confidently.
    
- It maximises bets on correct detections and minimises losses on incorrect ones.
    

- Imperfect Knowledge Mode:
    

- The AI has a configurable accuracy rate, introducing occasional errors to simulate real-world AI limitations.
    
- This mode allows for more balanced gameplay, especially in early research phases.
    

3. AI Decision-Making:
    

- The AI can employ advanced strategies, such as bluffing or varying its betting patterns to mimic human behaviour. This can be done via prompting.
    
- This adds complexity to the game, requiring human players to adapt and refine their strategies.
    

5. Difficulty Levels:
    

- Easy: The AI has lower betting stakes and limited detection capabilities.
    
- Medium: The AI balances between aggressive and conservative betting with moderate detection accuracy.
    
- Hard: The AI uses optimal strategies with high detection accuracy, posing a significant challenge to human players.
    

### Research Utility Enhancements

1. Data Collection:
    

- Detection Accuracy: Compare each player's accuracy against the AI's.
    
- Betting Patterns: Analyse how betting behaviours correlate with detection success and confidence levels.
    
- Decision-Making Process: Examine how players adjust strategies in response to AI behaviour and difficulty levels.
    
- Response Times: Measure how quickly players make their decisions, offering insights into cognitive processing and confidence.
    

3. Behavioural Insights:
    

- Risk Assessment: Study how players assess risk when betting against a knowledgeable AI.
    
- Adaptation: Observe how players adapt their strategies over time to counter the AI’s actions.
    
- Cognitive Load: Evaluate the mental effort required to detect AI-generated content under competitive conditions.
    

5. AI Performance Tuning:
    

- Use collected data to refine the AI’s detection algorithms and betting strategies.
    
- Implement machine learning techniques to allow the AI to learn and adapt from player behaviours, creating a dynamic research environment.
    

### Additional Features

1. Content Variety:
    

- Include a diverse range of images and videos, varying in complexity, style, and subject matter to test detection across different media types.
    

3. Game Modes:
    

- Competitive Mode: Players compete individually against the AI and each other.
    
- Team Mode: Players from teams to collaborate in detecting content and strategizing against the AI.
    
- Training Mode: Provide tutorials and practice rounds to help players improve their detection skills without impacting their scores.
    

5. Analytics Dashboard:
    

- Provide real-time analytics and post-game reports for researchers to analyse player performance, AI performance, and overall game dynamics.
    

7. Customization Options:
    

- Allow researchers to customise game parameters, such as the number of rounds, difficulty levels, and types of content, to suit specific research needs.
    

### Example Round Flow with AI Knowledge

1. Round Start:
    

- All human players have 100 betting chips.
    
- The AI is assigned its stack based on the selected difficulty level.
    

3. Content Presentation:
    

- A Content Card is drawn: an image or video is displayed to all participants.
    
- The AI instantly identifies whether the content is AI-generated or human-created.
    

5. Inspection Phase (30 seconds):
    

- Players examine the content, searching for subtle indicators of AI generation.
    

7. Betting Phase:
    

- Human Players:
    

- Decide how many chips to bet and on their detection ("AI" or "Human").
    

- AI Opponent:
    

- Based on its knowledge, the AI places its bets strategically.
    
- For example, if the AI knows the content is AI-generated, it may bet confidently on "AI."
    

9. Detection Phase:
    

- Human Players:
    

- Declare their guesses using Detection Tokens.
    

- AI Opponent:
    

- Automatically declares the correct detection ("AI" or "Human") unless configured for imperfect accuracy.
    

11. Resolution:
    

- Reveal the true nature of the Content Card.
    
- Scoring:
    

- Correct detections earn points equal to the bet.
    
- Incorrect detections result in point deductions.
    

- Update each player's and the AI's scores accordingly.
    

13. Next Round:
    

- Proceed to the next Content Card and repeat the process until the game concludes.