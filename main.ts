namespace SpriteKind {
    export const Obstacle = SpriteKind.create()
}
// 5. Springen mit der Leertaste / A-Knopf (Einfacher Sprung)
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (kannSpringen) {
        // Perfekte Sprungkraft für die neuen Level-Muster
        hero.vy = -140
        // In der Luft sperren
        kannSpringen = false
    }
})
// 4. Sicheres Lande-System (Stoppt die Ente auf den Plattformen)
sprites.onOverlap(SpriteKind.Player, SpriteKind.Obstacle, function (sprite, otherSprite) {
    if (sprite.vy >= 0 && sprite.y < otherSprite.y) {
        sprite.vy = 0
        sprite.y = otherSprite.y - 12
        // Sprung wieder erlauben
        kannSpringen = true
    }
})
// 3. Funktion, um das ausgewählte Level fehlerfrei zu bauen
function baueLevel (levelNummer: number) {
    // ALLE alten Plattformen zerstören und Liste leeren
    for (let p of plattformen) {
        if (p) {
            p.destroy()
        }
    }
    plattformen = []
    // Alte Trophäe komplett löschen
    if (trophaee) {
        trophaee.destroy()
        trophaee = null;
    }
    // Start-Plattform ganz links erstellen
    startPlattform = sprites.create(img`
        7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
        7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
        7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
        7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
        `, SpriteKind.Obstacle)
    startPlattform.setPosition(20, 100)
    plattformen.push(startPlattform)
    // Hole das einzigartige Design für dieses Level
    koordinaten = holeLevelMuster(levelNummer)
    letzteX = 20
    letzteY = 100
    // Platziere die Inseln nach dem genauen Muster
    for (let i = 0; i <= koordinaten.length - 1; i++) {
        plattform = sprites.create(img`
            7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
            7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
            7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
            7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
            `, SpriteKind.Obstacle)
        // X-Koordinate aus dem Muster
        neueX = koordinaten[i][0] + 20
        // Y-Koordinate aus dem Muster
        neueY = koordinaten[i][1]
        plattform.setPosition(neueX, neueY)
        plattformen.push(plattform)
        letzteX = neueX
        letzteY = neueY
    }
    // Trophäe (Ziel) erstellen - schwebend über der allerletzten Plattform
    trophaee = sprites.create(img`
        . . . 5 5 5 5 5 . . . 
        . . . 5 f 5 f 5 . . . 
        . 5 5 5 5 5 5 5 5 5 . 
        5 5 . 5 5 5 5 5 . 5 5 
        5 5 . 5 5 5 5 5 . 5 5 
        . 5 5 5 5 5 5 5 5 5 . 
        . . . . 5 5 5 . . . . 
        . . . . . 5 . . . . . 
        . . . 5 5 5 5 5 . . . 
        `, SpriteKind.Food)
    trophaee.setPosition(letzteX, letzteY - 16)
    // Spieler erstellen oder zurücksetzen
    if (!(hero)) {
        hero = sprites.create(img`
            . . . . . . . e e e e . . . . . 
            . . . . . e e 4 5 5 5 e e . . . 
            . . . . e 4 5 6 2 2 7 6 6 e . . 
            . . . e 5 6 6 7 2 2 6 4 4 4 e . 
            . . e 5 2 2 7 6 6 4 5 5 5 5 4 . 
            . e 5 6 2 2 8 8 5 5 5 5 5 4 5 4 
            . e 5 6 7 7 8 5 4 5 4 5 5 5 5 4 
            e 4 5 8 6 6 5 5 5 5 5 5 4 5 5 4 
            e 5 c e 8 5 5 5 4 5 5 5 5 5 5 4 
            e 5 c c e 5 4 5 5 5 4 5 5 5 e . 
            e 5 c c 5 5 5 5 5 5 5 5 4 e . . 
            e 5 e c 5 4 5 4 5 5 5 e e . . . 
            e 5 e e 5 5 5 5 5 4 e . . . . . 
            4 5 4 e 5 5 5 5 e e . . . . . . 
            . 4 5 4 5 5 4 e . . . . . . . . 
            . . 4 4 e e e . . . . . . . . . 
            `, SpriteKind.Player)
        // Optimierte Laufgeschwindigkeit
        controller.moveSprite(hero, 85, 0)
        scene.cameraFollowSprite(hero)
    }
    // Spieler absolut sicher auf die erste Plattform setzen
    hero.ay = 0
    hero.vy = 0
    hero.setPosition(20, 80)
    // Ausbalancierte Schwerkraft
    hero.ay = 310
    kannSpringen = true
    // Zeige das aktuelle Level kurz an
    game.splash("Level " + levelNummer)
}
// 2. Festgelegte Muster für alle 10 Level (X-Abstand, Y-Höhe)
// Jedes Level fühlt sich jetzt völlig anders an!
function holeLevelMuster (levelNummer: number) {
    if (levelNummer == 1) {
        // Level 1: Ganz einfacher Zick-Zack zum Start
        return [[45, 90], [90, 75], [135, 90]]
    } else if (levelNummer == 2) {
        // Level 2: Eine Treppe, die stetig nach oben geht
        return [
        [45, 95],
        [90, 80],
        [135, 65],
        [180, 50]
        ]
    } else if (levelNummer == 3) {
        // Level 3: Große Lücke in der Mitte (Achtung beim Sprung!)
        return [[45, 90], [105, 90], [150, 90]]
    } else if (levelNummer == 4) {
        // Level 4: Achterbahn (Erst tief runter, dann steil hoch)
        return [
        [45, 110],
        [90, 110],
        [135, 80],
        [180, 50]
        ]
    } else if (levelNummer == 5) {
        // Level 5: Der "Berg" (Hoch und wieder runter)
        return [
        [45, 85],
        [90, 60],
        [135, 60],
        [180, 85],
        [225, 100]
        ]
    } else if (levelNummer == 6) {
        // Level 6: Sehr schmale Lücken, dafür viele kleine Inseln
        return [
        [40, 90],
        [80, 90],
        [120, 90],
        [160, 90],
        [200, 90]
        ]
    } else if (levelNummer == 7) {
        // Level 7: Der tiefe Fall (Plattformen sehr weit unten)
        return [
        [50, 105],
        [100, 110],
        [150, 110],
        [200, 80]
        ]
    } else if (levelNummer == 8) {
        // Level 8: Himmels-Hüpfer (Sehr weit oben in der Luft)
        return [
        [45, 60],
        [90, 50],
        [135, 60],
        [180, 50]
        ]
    } else if (levelNummer == 9) {
        // Level 9: Unregelmäßige Abstände (Man muss genau timen)
        return [
        [42, 95],
        [95, 70],
        [138, 90],
        [190, 65]
        ]
    } else {
        // Level 10: Das Finale Meister-Level (Sehr lang und anspruchsvoll)
        return [
        [45, 100],
        [90, 85],
        [135, 70],
        [180, 55],
        [225, 70],
        [270, 85],
        [315, 60]
        ]
    }
}
// 6. Kollision mit der Trophäe = Nächstes Level
sprites.onOverlap(SpriteKind.Player, SpriteKind.Food, function (sprite, otherSprite) {
    otherSprite.destroy()
    aktuellesLevel += 1
    if (aktuellesLevel > 10) {
        // Alle 10 unterschiedlichen Level geschafft -> SIEG!
        game.gameOver(true)
    } else {
        music.powerUp.play()
        // Nächstes, ganz neues Level laden
        baueLevel(aktuellesLevel)
    }
})
let neueY = 0
let neueX = 0
let plattform: Sprite = null
let letzteY = 0
let letzteX = 0
let koordinaten: number[][] = []
let startPlattform: Sprite = null
let plattformen: Sprite[] = []
let hero: Sprite = null
let kannSpringen = false
let aktuellesLevel = 0
let trophaee: Sprite = null
// 1. Hintergrund einrichten
// Blauer Himmel
scene.setBackgroundColor(9)
// Globale Variablen
aktuellesLevel = 1
// Starte direkt mit Level 1
baueLevel(aktuellesLevel)
// 7. Im Abgrund sterben (Game Over)
game.onUpdate(function () {
    if (hero.y > 145) {
        // Absturz = Verloren
        game.gameOver(false)
    }
})
