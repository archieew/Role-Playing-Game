let xp = 0;
let health = 100;
let maxHealth = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let maxMonsterHealth;
let inventory = ["stick"];
let combo = 0;
let criticalHits = 0;
let specialAbilityCooldown = 0;
let gameLevel = 1;

const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const textContent = document.querySelector("#textContent");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const healthBar = document.querySelector("#healthBar");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
const monsterHealthBar = document.querySelector("#monsterHealthBar");
const inventoryDiv = document.querySelector("#inventory");
const inventoryText = document.querySelector("#inventoryText");

const attackSound = document.querySelector('#attackSound');
const healSound = document.querySelector('#healSound');
const victorySound = document.querySelector('#victorySound');
const defeatSound = document.querySelector('#defeatSound');

const weapons = [
  { name: 'stick', power: 5, icon: '🥢', special: null },
  { name: 'dagger', power: 30, icon: '🗡️', special: 'stealth' },
  { name: 'claw hammer', power: 50, icon: '🔨', special: 'stun' },
  { name: 'sword', power: 100, icon: '⚔️', special: 'critical' },
  { name: 'magic staff', power: 150, icon: '🪄', special: 'fireball' }
];
const monsters = [
  {
    name: "slime",
    level: 2,
    health: 15,
    icon: "🟢",
    ability: "split",
    description: "A gooey green slime that splits when hit"
  },
  {
    name: "fanged beast",
    level: 8,
    health: 60,
    icon: "🐺",
    ability: "rage",
    description: "A ferocious beast with sharp fangs"
  },
  {
    name: "dragon",
    level: 20,
    health: 300,
    icon: "🐉",
    ability: "firebreath",
    description: "A mighty dragon with scales like armor"
  }
]
const locations = [
  {
    name: "town square",
    "button text": ["🏪 Go to store", "🏔️ Go to cave", "🐉 Fight dragon"],
    "button functions": [goStore, goCave, fightDragon],
    text: "🏘️ You are in the bustling town square. The air is filled with the sounds of merchants and adventurers. You see a sign that says \"Store\" and hear distant roars from the cave."
  },
  {
    name: "store",
    "button text": ["❤️ Buy 10 health (10 gold)", "⚔️ Buy weapon (30 gold)", "🏘️ Go to town square"],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "🏪 You enter the mystical store. The shopkeeper eyes you with interest. \"Welcome, brave adventurer! What can I help you with today?\""
  },
  {
    name: "cave",
    "button text": ["🟢 Fight slime", "🐺 Fight fanged beast", "🏘️ Go to town square"],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "🏔️ You enter the dark cave. Strange sounds echo through the tunnels. Your torch reveals ancient markings on the walls."
  },
  {
    name: "fight",
    "button text": ["⚔️ Attack", "🛡️ Dodge", "🏃 Run"],
    "button functions": [attack, dodge, goTown],
    text: "⚔️ You are locked in combat with a fearsome monster!"
  },
  {
    name: "kill monster",
    "button text": ["🏘️ Go to town square", "🏘️ Go to town square", "🏘️ Go to town square"],
    "button functions": [goTown, goTown, easterEgg],
    text: '🎉 The monster screams "Arg!" as it dies. You gain experience points and find gold!'
  },
  {
    name: "lose",
    "button text": ["🔄 REPLAY?", "🔄 REPLAY?", "🔄 REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "💀 You have fallen in battle. The darkness claims you... 💀"
  },
  { 
    name: "win", 
    "button text": ["🏆 REPLAY?", "🏆 REPLAY?", "🏆 REPLAY?"], 
    "button functions": [restart, restart, restart], 
    text: "🎊 You defeat the dragon! The town is saved! YOU WIN THE GAME! 🎊" 
  },
  {
    name: "easter egg",
    "button text": ["2", "8", "🏘️ Go to town square?"],
    "button functions": [pickTwo, pickEight, goTown],
    text: "🎲 You find a secret game! Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If your number matches, you win!"
  }
];

button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;
updateInventory();

function update(location) {
  monsterStats.style.display = "none";
  inventoryDiv.style.display = "none";
  
  animateButtonText(button1, location["button text"][0]);
  animateButtonText(button2, location["button text"][1]);
  animateButtonText(button3, location["button text"][2]);
  
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  
  animateTextChange(location.text);
  
  specialAbilityCooldown = Math.max(0, specialAbilityCooldown - 1);
}

function animateButtonText(button, newText) {
  button.style.transform = "scale(0.95)";
  setTimeout(() => {
    button.innerHTML = newText;
    button.style.transform = "scale(1)";
  }, 100);
}

function animateTextChange(newText) {
  textContent.style.opacity = "0";
  textContent.style.transform = "translateY(-10px)";
  
  setTimeout(() => {
    textContent.innerHTML = newText;
    textContent.style.opacity = "1";
    textContent.style.transform = "translateY(0)";
  }, 200);
}

function goTown() {
  update(locations[0]);
  createParticles(20, "#4ecdc4");
}

function goStore() {
  update(locations[1]);
  createParticles(15, "#ffd93d");
}

function goCave() {
  update(locations[2]);
  createParticles(25, "#6c5ce7");
}

function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    const healAmount = 10;
    health = Math.min(maxHealth, health + healAmount);
    
    updateStats();
    playSound(healSound);
    createHealEffect(healAmount);
    showFloatingText(`+${healAmount} HP`, "#4ecdc4");
    
    textContent.innerHTML = "❤️ You feel revitalized! Your health has been restored.";
  } else {
    showFloatingText("Not enough gold!", "#ff6b6b");
    textContent.innerHTML = "❌ You do not have enough gold to buy health.";
  }
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      
      const newWeapon = weapons[currentWeapon];
      inventory.push(newWeapon.name);
      
      updateStats();
      updateInventory();
      createParticles(30, "#feac32");
      showFloatingText(`New weapon: ${newWeapon.icon}`, "#feac32");
      
      textContent.innerHTML = `⚔️ You now wield a mighty ${newWeapon.name} ${newWeapon.icon}!`;
      inventoryDiv.style.display = "block";
    } else {
      showFloatingText("Not enough gold!", "#ff6b6b");
      textContent.innerHTML = "❌ You do not have enough gold to buy a weapon.";
    }
  } else {
    textContent.innerHTML = "⚔️ You already have the most powerful weapon!";
    button2.innerHTML = "💰 Sell weapon for 15 gold";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    const soldWeapon = inventory.shift();
    
    updateStats();
    updateInventory();
    createParticles(20, "#ffd93d");
    showFloatingText("+15 Gold", "#ffd93d");
    
    textContent.innerHTML = `💰 You sold your ${soldWeapon} for 15 gold!`;
  } else {
    textContent.innerHTML = "❌ Don't sell your only weapon!";
  }
}

function fightSlime() {
  fighting = 0;
  goFight();
}

function fightBeast() {
  fighting = 1;
  goFight();
}

function fightDragon() {
  fighting = 2;
  goFight();
}

function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  maxMonsterHealth = monsterHealth;
  
  monsterStats.style.display = "block";
  monsterName.innerHTML = `${monsters[fighting].icon} ${monsters[fighting].name}`;
  monsterHealthText.innerText = monsterHealth;
  updateMonsterHealthBar();
  
  createParticles(40, "#c70d0d");
  game.classList.add("shake");
  setTimeout(() => game.classList.remove("shake"), 500);
}

function attack() {
  playSound(attackSound);
  game.classList.add("shake");
  setTimeout(() => game.classList.remove("shake"), 300);
  
  const monster = monsters[fighting];
  const weapon = weapons[currentWeapon];
  
  let damage = weapon.power + Math.floor(Math.random() * xp) + 1;
  let isCritical = false;
  let specialEffect = "";
  
  if (Math.random() < (xp / 100) * 0.3) {
    damage = Math.floor(damage * 1.5);
    isCritical = true;
    criticalHits++;
    specialEffect = " 💥 CRITICAL HIT!";
  }
  
  combo++;
  if (combo > 1) {
    damage += combo * 5;
    specialEffect += ` 🔥 COMBO x${combo}!`;
  }
  
  if (weapon.special && specialAbilityCooldown === 0) {
    switch (weapon.special) {
      case 'stealth':
        damage += 20;
        specialEffect += " 🥷 STEALTH STRIKE!";
        break;
      case 'stun':
        damage += 15;
        specialEffect += " ⚡ STUNNED!";
        break;
      case 'critical':
        damage += 25;
        specialEffect += " ⚔️ SWORD MASTERY!";
        break;
      case 'fireball':
        damage += 40;
        specialEffect += " 🔥 FIREBALL!";
        createParticles(50, "#ff6b35");
        break;
    }
    specialAbilityCooldown = 3;
  }
  
  if (isMonsterHit()) {
    monsterHealth -= damage;
    showFloatingText(`-${damage}`, "#ff6b6b");
    createParticles(20, "#ff6b6b");
  } else {
    damage = 0;
    combo = 0;
    specialEffect = " ❌ MISS!";
  }
  
  const monsterDamage = getMonsterAttackValue(monster.level);
  health -= monsterDamage;
  
  if (monsterDamage > 0) {
    showFloatingText(`-${monsterDamage}`, "#c70d0d");
  }
  
  updateStats();
  updateMonsterHealthBar();
  
  let combatText = `⚔️ You attack the ${monster.name} with your ${weapon.name} ${weapon.icon}.`;
  if (damage > 0) {
    combatText += ` You deal ${damage} damage!${specialEffect}`;
  }
  combatText += `\n${monster.icon} The ${monster.name} attacks back for ${monsterDamage} damage!`;
  
  textContent.innerHTML = combatText;
  textContent.classList.add("combat-text");
  setTimeout(() => textContent.classList.remove("combat-text"), 500);
  
  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    if (fighting === 2) {
      winGame();
    } else {
      defeatMonster();
    }
  }
  
  if (Math.random() <= 0.1 && inventory.length !== 1) {
    const brokenWeapon = inventory.pop();
    currentWeapon--;
    updateInventory();
    textContent.innerHTML += `\n💔 Your ${brokenWeapon} breaks!`;
    createParticles(30, "#6c5ce7");
  }
}

function getMonsterAttackValue(level) {
  const hit = (level * 5) - (Math.floor(Math.random() * xp));
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() > 0.2 || health < 20;
}

function dodge() {
  const dodgeChance = Math.random();
  if (dodgeChance > 0.5) {
    combo = 0;
    textContent.innerHTML = `🛡️ You successfully dodge the ${monsters[fighting].name}'s attack!`;
    createParticles(15, "#4ecdc4");
  } else {
    const damage = getMonsterAttackValue(monsters[fighting].level);
    health -= damage;
    updateStats();
    showFloatingText(`-${damage}`, "#c70d0d");
    textContent.innerHTML = `❌ You fail to dodge! The ${monsters[fighting].name} hits you for ${damage} damage!`;
  }
}

function defeatMonster() {
  const monster = monsters[fighting];
  const goldGain = Math.floor(monster.level * 6.7);
  const xpGain = monster.level;
  
  gold += goldGain;
  xp += xpGain;
  combo = 0;
  
  updateStats();
  createParticles(60, "#4ecdc4");
  showFloatingText(`+${xpGain} XP`, "#4ecdc4");
  showFloatingText(`+${goldGain} Gold`, "#ffd93d");
  
  update(locations[4]);
  
  if (xp >= gameLevel * 10) {
    levelUp();
  }
}

function lose() {
  playSound(defeatSound);
  game.classList.add("defeat");
  update(locations[5]);
}

function winGame() {
  playSound(victorySound);
  game.classList.add("victory");
  update(locations[6]);
}

function restart() {
  xp = 0;
  health = 100;
  maxHealth = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["stick"];
  combo = 0;
  criticalHits = 0;
  specialAbilityCooldown = 0;
  gameLevel = 1;
  
  updateStats();
  updateInventory();
  game.classList.remove("victory", "defeat");
  
  goTown();
}

function easterEgg() {
  update(locations[7]);
}

function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}

function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  
  let resultText = `🎲 You picked ${guess}. Here are the random numbers:\n`;
  for (let i = 0; i < 10; i++) {
    resultText += numbers[i] + " ";
  }
  
  if (numbers.includes(guess)) {
    resultText += "\n🎉 Right! You win 20 gold!";
    gold += 20;
    updateStats();
    createParticles(30, "#ffd93d");
    showFloatingText("+20 Gold", "#ffd93d");
  } else {
    resultText += "\n❌ Wrong! You lose 10 health!";
    health -= 10;
    updateStats();
    showFloatingText("-10 HP", "#ff6b6b");
    if (health <= 0) {
      lose();
    }
  }
  
  textContent.innerHTML = resultText;
}

function updateStats() {
  xpText.innerText = xp;
  healthText.innerText = health;
  goldText.innerText = gold;
  
  const healthPercent = (health / maxHealth) * 100;
  healthBar.style.width = `${healthPercent}%`;
}

function updateMonsterHealthBar() {
  monsterHealthText.innerText = monsterHealth;
  const healthPercent = (monsterHealth / maxMonsterHealth) * 100;
  monsterHealthBar.style.width = `${healthPercent}%`;
}

function updateInventory() {
  if (inventory.length > 1) {
    inventoryText.innerHTML = inventory.map(item => {
      const weapon = weapons.find(w => w.name === item);
      return weapon ? `${weapon.icon} ${item}` : item;
    }).join(" ");
    inventoryDiv.style.display = "block";
  } else {
    inventoryDiv.style.display = "none";
  }
}

function levelUp() {
  gameLevel++;
  maxHealth += 20;
  health = maxHealth;
  
  createParticles(100, "#4ecdc4");
  showFloatingText("LEVEL UP!", "#4ecdc4");
  
  textContent.innerHTML = `🎊 LEVEL UP! You are now level ${gameLevel}! Your max health increased to ${maxHealth}!`;
  
  updateStats();
}

function createParticles(count, color) {
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.backgroundColor = color;
    particle.style.width = Math.random() * 4 + 2 + 'px';
    particle.style.height = particle.style.width;
    particle.style.borderRadius = '50%';
    
    game.appendChild(particle);
    
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, 2000);
  }
}

function showFloatingText(text, color) {
  const floatingText = document.createElement('div');
  floatingText.className = 'damage-text';
  floatingText.textContent = text;
  floatingText.style.color = color;
  floatingText.style.left = Math.random() * 60 + 20 + '%';
  floatingText.style.top = Math.random() * 40 + 30 + '%';
  
  game.appendChild(floatingText);
  
  setTimeout(() => {
    if (floatingText.parentNode) {
      floatingText.parentNode.removeChild(floatingText);
    }
  }, 1000);
}

function createHealEffect(amount) {
  const healEffect = document.createElement('div');
  healEffect.style.position = 'absolute';
  healEffect.style.left = '50%';
  healEffect.style.top = '50%';
  healEffect.style.transform = 'translate(-50%, -50%)';
  healEffect.style.fontSize = '3em';
  healEffect.style.color = '#4ecdc4';
  healEffect.style.pointerEvents = 'none';
  healEffect.style.zIndex = '1000';
  healEffect.innerHTML = '❤️';
  
  game.appendChild(healEffect);
  
  healEffect.style.animation = 'healPulse 1s ease-out';
  
  setTimeout(() => {
    if (healEffect.parentNode) {
      healEffect.parentNode.removeChild(healEffect);
    }
  }, 1000);
}

function playSound(audioElement) {
  if (audioElement) {
    audioElement.currentTime = 0;
    audioElement.play().catch(e => console.log('Audio play failed:', e));
  }
}
