# 🥙 מלך הפלאפל (Falafel King)

A fun browser-based falafel-making game built with PixiJS v8.

## 🎮 Game Overview

Run a falafel stand and serve customers by assembling the perfect falafel pita according to their orders. Race against time and keep your customers happy!

## 🎯 How to Play

1. **Start the Game**: Click "התחל משחק!" on the main menu
2. **Check the Order**: Look at the order display on the left to see what the customer wants
3. **Drag Ingredients**: Drag ingredients from the palette into the assembly area
4. **Serve**: When ready, click "הגש!" to serve the customer
5. **Earn Points**: Get points for correct orders, lose points for mistakes

## 🏗️ Game Features

- **5 Customers**: Serve 5 customers in 2.5 minutes (150 seconds)
- **8 Ingredients**: Pita, Falafel Balls, Hummus, Tahini, Salad, Fries, Pickles, Onion
- **Click or Drag**: Simple click to add ingredients or drag them to the assembly area
- **Clear Button**: Made a mistake? Use the "נקה" button to start over
- **Patience System**: Customers lose patience slowly - you have plenty of time!
- **Scoring System**: Perfect orders = 100 points, partial matches get partial points
- **Responsive UI**: Works on desktop browsers

## 🚀 Running the Game

```bash
# Development
npm run dev

# Build for production
npm run build

# Lint code
npm run lint
```

## 📂 Project Structure

```
src/
├── scenes/          # Game scenes (Menu, Game, GameOver)
├── sprites/         # Game entities (Customer, DraggableIngredient, PitaAssembly)
├── ui/              # UI components (ScoreBoard, Timer, OrderDisplay)
├── utils/           # Utilities (OrderGenerator, OrderValidator, SpriteFactory)
├── types/           # TypeScript type definitions
└── main.ts          # Entry point
```

## 🎨 Customization

### Change Game Duration
Edit [src/scenes/GameScene.ts:33](src/scenes/GameScene.ts#L33) and [src/scenes/GameScene.ts:51](src/scenes/GameScene.ts#L51) - change the time values (default: 150 seconds)

### Change Number of Customers
Edit [src/scenes/GameScene.ts:84](src/scenes/GameScene.ts#L84) - change the count in `generateCustomers(5)`

### Adjust Drop Zone Sensitivity
Edit [src/sprites/PitaAssembly.ts:122](src/sprites/PitaAssembly.ts#L122) - change the `padding` value (default: 50 pixels)

### Modify Scoring
Edit [src/utils/OrderValidator.ts:56-77](src/utils/OrderValidator.ts#L56-L77) - adjust the accuracy thresholds and scores

## 🛠️ Tech Stack

- **PixiJS v8.8.1** - 2D rendering engine
- **TypeScript v5.7.3** - Type-safe development
- **Vite v6.2.0** - Fast build tool and dev server
- **ESLint + Prettier** - Code quality

## 🎮 Game Mechanics

- **Drag & Drop**: Fully functional ingredient dragging with snap detection
- **Order Validation**: Smart validation that gives partial credit for partially correct orders
- **Customer Patience**: Visual patience bars that decrease over time
- **Feedback System**: On-screen feedback for success/failure
- **Scene Management**: Clean scene transitions (Menu → Game → Game Over)

## 📝 Next Steps (Ideas for Enhancement)

1. **Real Graphics**: Replace placeholder sprites with actual food images
2. **Sound Effects**: Add sound effects for drag, drop, success, failure
3. **Difficulty Levels**: Easy/Medium/Hard with different time limits and order complexity
4. **Power-ups**: Speed boosts, time freeze, etc.
5. **Leaderboard**: Track high scores
6. **Mobile Support**: Add touch controls optimization
7. **More Ingredients**: Expand the ingredient palette
8. **Animations**: Add juice with better animations (shake, bounce, particles)

## 🐛 Known Improvements Made

- ✅ Improved drag-and-drop sensitivity with 50px padding
- ✅ Fixed all TypeScript linting errors
- ✅ Made ingredient sprites more clickable
- ✅ Added visual feedback for all game actions

Enjoy the game! 🥙
