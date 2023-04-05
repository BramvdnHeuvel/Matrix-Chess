module Chess exposing (GameState, GameSummary, accountDataEventType, encodeChessMove, encodeInviteEvent, gameChessMoveEventType, gameInviteEventType, getGames, myTurn, opponent, resolve)

{-| In this module, we calculate the state of each game by looking at the Matrix Vault.

You can read through this file to gain an understanding of how the program works.
The Elm programming language is meant to be easy to understand,
so you shouldn't have a hard time going through this file. :)

-}

import Dict
import Game
import Internal.Tools.Timestamp as Timestamp
import Json.Decode as D
import Json.Encode as E
import Matrix
import Matrix.Event
import Matrix.Room
import PieceColor
import Position
import Time


{-| Users can send a `me.noordstar.game.invite` event to each other, inviting each
other to play a game.

This event looks as follows:

```json
    {
        "type": "me.noordstar.game.invite",
        "content": {
            "id": "me.noordstar.chess.1v1",
            "data": {
                "black": "@alice:example.org",
                "white": "@bob:example.org"
            }
        }
    }
```

-}
gameInviteEventType : String
gameInviteEventType =
    "me.noordstar.game.invite"


{-| This is the relevant data that can be exchanged.
This event invites users to play a game.
-}
type alias InviteEvent =
    { black : String, white : String }


{-| Encode an invite to a game into a JSON value.
-}
encodeInviteEvent : InviteEvent -> E.Value
encodeInviteEvent { black, white } =
    E.object
        [ ( "id", E.string gameId )
        , ( "data"
          , E.object
                [ ( "black", E.string black )
                , ( "white", E.string white )
                ]
          )
        ]


{-| Decode a JSON value into an invite to a game.
-}
inviteEventDecoder : D.Decoder InviteEvent
inviteEventDecoder =
    D.field "id" D.string
        |> D.andThen
            (\gId ->
                -- Verify that it's the right game type
                if gId == gameId then
                    D.map2
                        (\b w -> { black = b, white = w })
                        (D.at [ "data", "black" ] D.string)
                        (D.at [ "data", "white" ] D.string)

                else
                    D.fail "Unsupported game type."
            )


{-| As can be seen in the documentation example above, the `id` field leaves room
for different games to be implemented.

This allows `me.noordstar.game.invite` to be a standardised event for setting up games,
with `data` being a field for additional metadata that may be relevant for a game.

As a benefit, this allows room moderators to restrict usage on multiple games by setting
a power level for the `me.noordstar.game.invite` event type.

-}
gameId : String
gameId =
    "me.noordstar.chess.1v1"


{-| Once users have received an invite, they may then accept the invite by responding with the following event:

```json
    {
        "type": "me.noordstar.game.chess.accept",
        "content": {
            "reason": "Optional reason field",

            "m.relates_to": {
                "event_id": "<event_id of the original game invite>",
                "relType": "me.noordstar.game.meta"
            }
        }
    }
```

-}
acceptChessEventType : String
acceptChessEventType =
    "me.noordstar.game.chess.accept"


{-| This is the event that indicates that the user has accepted playing a game.
-}
type alias ChessAccept =
    { reason : Maybe String, relatedTo : String }


{-| Encode an event to accept an invitation to a game of chess into a JSON value.
-}
encodeAcceptChess : ChessAccept -> E.Value
encodeAcceptChess { reason, relatedTo } =
    [ Maybe.map (E.string >> Tuple.pair "reason") reason
    , Just
        ( "m.relates_to"
        , E.object
            [ ( "event_id", E.string relatedTo )
            , ( "relType", E.string gameMetaRelType )
            ]
        )
    ]
        |> List.filterMap identity
        |> E.object


{-| Decode a JSON value into an event to accept an invitation to game of chess.
-}
acceptChessDecoder : D.Decoder ChessAccept
acceptChessDecoder =
    D.at [ "m.relates_to", "relType" ] D.string
        |> D.andThen
            (\relType ->
                -- Verify that it's the right relationship type
                if relType == gameMetaRelType then
                    D.map2
                        (\reason relatedTo -> { reason = reason, relatedTo = relatedTo })
                        (D.maybe <| D.field "reason" D.string)
                        (D.at [ "m.relates_to", "event_id" ] D.string)

                else
                    D.fail "Invalid relType for accepting a chess game."
            )


{-| Relationship type of each overhead event that is sharing information about a game.
This relationship type is to indicate that it is about the overhead of the game
(who's playing, who's joining, who's leaving) rather than about the game itself.

This way, all child events of the original invite can easily be queried,
allowing players to gain all relevant events of the game within a single timeline.
Additionally, they can be filtered based on their relationship type.

-}
gameMetaRelType : String
gameMetaRelType =
    "me.noordstar.game.meta"


{-| Alternatively, users may politely decline an invite by sending the following event:

```json
    {
        "type": "me.noordstar.game.chess.reject",
        "content": {
            "reason": "Optional reason field",

            "m.relates_to": {
                "event_id": "<event_id of the original game invite>",
                "relType": "me.noordstar.game.meta"
            }
        }
    }
```

-}
rejectChessEventType : String
rejectChessEventType =
    "me.noordstar.game.chess.reject"


type alias ChessReject =
    { reason : Maybe String, relatedTo : String }


{-| Encode an event to reject an invitation to a game of chess.
-}
encodeRejectChess : ChessReject -> E.Value
encodeRejectChess =
    encodeAcceptChess


{-| Decode a JSON value into an event to reject an invitation to game of chess.
-}
rejectChessDecoder : D.Decoder ChessReject
rejectChessDecoder =
    acceptChessDecoder


{-| Once the game has been established, it is assumed that both players will remember the state.
This can be done by using the account data on a given room, or a client may choose to keep track of
the game state in a different manner - it is considered their own responsibility.

As a recommended approach, account data will be used per room. The following event type name
will be used for tracking the chess games.

-}
accountDataEventType : String
accountDataEventType =
    "me.noordstar.game.chess"


{-| To play the game of chess, players will share a PGN-format chess game with each other.
One example of a PGN-formatted game, is the following:

```pgn
[Event "?"]
[Site "?"]
[Date "????.??.??"]
[Round "?"]
[White "?"]
[Black "?"]
[Result "1-0"]

1. d4 b6 2. e4 Bb7 3. Nc3 c6 4. Nf3 e6 5. Bf4 d5 6. exd5 cxd5 7. Bb5+ Nd7 8. Ne5
a6 9. Bxd7+ Ke7 10. Qh5 f6 11. Qf7+ Kd6 12. Nc4# 1-0
```

Using the game event type "me.noordstar.game.chess.move", players will each append
new moves to the game. Players can only append a move when it is their turn,
and they must always respond in a valid PGN-format.

An event would look as follows:

```json
    {
        "type": "me.noordstar.game.chess.move",
        "content": {
            "pgn": "<PGN-formatted chess game>",
            "last_move": "<event_id of the previous event that was a valid move>",

            "m.relates_to": {
                "event_id": "<event_id of the original game invite>",
                "relType": "me.noordstar.game.move"
            }
        }
    }
```

If this event is the first valid move event, it points to the original game invite.

-}
gameChessMoveEventType : String
gameChessMoveEventType =
    "me.noordstar.game.chess.move"


type alias ChessMove =
    { newGame : Game.Game, lastMove : String, relatedTo : String }


{-| Encode an event to make a chess move.
-}
encodeChessMove : ChessMove -> E.Value
encodeChessMove { newGame, lastMove, relatedTo } =
    E.object
        [ ( "pgn", encodePGN newGame )
        , ( "last_move", E.string lastMove )
        , ( "m.relates_to"
          , E.object
                [ ( "event_id", E.string relatedTo )
                , ( "relType", E.string gameChessMoveRelType )
                ]
          )
        ]


{-| Decode a JSON value into an event to make a chess move.
-}
chessMoveDecoder : D.Decoder ChessMove
chessMoveDecoder =
    D.at [ "m.relates_to", "relType" ] D.string
        |> D.andThen
            (\relType ->
                if relType == gameChessMoveRelType then
                    D.map3
                        (\g lm r -> { newGame = g, lastMove = lm, relatedTo = r })
                        (D.field "pgn" pgnDecoder)
                        (D.field "last_move" D.string)
                        (D.at [ "m.relates_to", "event_id" ] D.string)

                else
                    D.fail "Invalid relType for making a move in chess."
            )


{-| Relationship type of each chess move event to its parent.
The parent of all chess move events is the event where the first player asked
the second player to play a game of chess.

This way, all child events of the original invite can easily be queried,
allowing players to gain all relevant events of the game within a single timeline.

-}
gameChessMoveRelType : String
gameChessMoveRelType =
    "me.noordstar.game.move"


{-| This event is meant to indicate that a user has chosen to leave a game.
In a 1v1 chess game, this effectively means that they resign.

An event would look like the following:

```json
    {
        "type": "me.noordstar.game.leave",
        "content": {
            "reason": "Optional reason field",

            "m.relates_to": {
                "event_id": "<event_id of the original game invite>",
                "relType": "me.noordstar.game.meta"
            }
        }
    }
```

-}
gameLeaveEventType : String
gameLeaveEventType =
    "me.noordstar.game.leave"


type alias GameLeave =
    { reason : Maybe String, relatedTo : String }


{-| Encode an event to leave a game.
-}
encodeLeaveGame : GameLeave -> E.Value
encodeLeaveGame =
    encodeAcceptChess


leaveGameDecoder : D.Decoder GameLeave
leaveGameDecoder =
    acceptChessDecoder


{-| These events determine the state of the game.

We will track the progress with our AccountData type, which will be saved on the server.

-}
type alias AccountData =
    Dict.Dict String GameState


{-| Every GameState looks as follows. We can update it whenever we encounter a new move.
-}
type alias GameState =
    { black : String
    , game : Game.Game
    , lastMove : String
    , lastUpdatedAt : Timestamp.Timestamp
    , white : String
    }


{-| Encode a GameState into a JSON value.
-}
encodeGameState : GameState -> E.Value
encodeGameState { black, game, lastMove, lastUpdatedAt, white } =
    E.object
        [ ( "black", E.string black )
        , ( "last_move", E.string lastMove )
        , ( "origin_server_ts", Timestamp.encodeTimestamp lastUpdatedAt )
        , ( "pgn", encodePGN game )
        , ( "white", E.string white )
        ]


{-| Decode a JSON value into a GameState.
-}
gameStateDecoder : D.Decoder GameState
gameStateDecoder =
    D.map5
        (\b g e o w -> { black = b, game = g, lastMove = e, lastUpdatedAt = o, white = w })
        (D.field "black" D.string)
        (D.field "pgn" pgnDecoder)
        (D.field "last_move" D.string)
        (D.field "origin_server_ts" Timestamp.timestampDecoder)
        (D.field "white" D.string)


{-| Encode an AccountData type into a JSON value.
-}
encodeAccountData : AccountData -> E.Value
encodeAccountData =
    E.dict identity encodeGameState


{-| Decode a JSON value into an AccountData type.
-}
accountDataDecoder : D.Decoder AccountData
accountDataDecoder =
    D.dict gameStateDecoder



{- Starting from here, we will validate events.

   Any user can send a "me.noordstar.game.chess.move" event into a Matrix room,
   and we need to make sure that we care about the event:

   1. We might not be playing against the sender.
   2. It might not be the sender's turn.
   3. The sender might attempt to make multiple moves, bot for themselves and for you, to gain a more advantageous position.
   4. We might be playing multiple games against the sender.
   5. The sender might make a move in a different game against a different player.
-}


{-| This function checks whether the sender of an event is allowed to send an event
amending to the list of chess moves.
-}
isAllowedToMove : String -> GameState -> Bool
isAllowedToMove sender { black, game, white } =
    let
        position : Position.Position
        position =
            game
                |> Game.toEnd
                |> Game.position
    in
    if Position.isCheckmate position then
        False

    else if Position.sideToMove position == PieceColor.black then
        sender == black

    else
        sender == white


{-| This function makes sure that a new proposed game is only one more turn than the previous game.
Also, we need to make sure the history of the game is identical.
This is important because a malicious sender might:

1.  Make us make moves that would put us in a very bad position.
2.  Move a few pieces back and forth so it seems only one turn has been made, but we might accidentally cause a draw on our turn.
3.  Change the history of our game to approach the 50-turns rule in an attempt to force a draw.

-}
isOneMoreMove : Game.Game -> Game.Game -> Bool
isOneMoreMove game1 game2 =
    let
        newGame : Maybe Game.Game
        newGame =
            game2
                |> Game.moves
                |> List.reverse
                |> List.head
                |> Maybe.map (\move -> Game.addMove move (Game.toEnd game1))
    in
    case newGame of
        Nothing ->
            False

        Just g ->
            Game.toEnd g == Game.toEnd game2



{- Using the values, we can fold the timeline to look for updates to our game. -}


{-| The RelevantEvent type lists all potential relevant event types for our games.
-}
type RelevantEvent
    = Invite InviteEvent
    | Accept ChessAccept
    | Reject ChessReject
    | Move ChessMove
    | Leave GameLeave


relevantEventDecoder : String -> D.Decoder RelevantEvent
relevantEventDecoder eventType =
    if eventType == gameInviteEventType then
        D.map Invite inviteEventDecoder

    else if eventType == acceptChessEventType then
        D.map Accept acceptChessDecoder

    else if eventType == rejectChessEventType then
        D.map Reject rejectChessDecoder

    else if eventType == gameChessMoveEventType then
        D.map Move chessMoveDecoder

    else if eventType == gameLeaveEventType then
        D.map Leave leaveGameDecoder

    else
        D.fail "Not a relevant event."


decodeRelevantEvent : Matrix.Event.Event -> Maybe RelevantEvent
decodeRelevantEvent event =
    event
        |> Matrix.Event.content
        |> D.decodeValue (relevantEventDecoder (Matrix.Event.eventType event))
        |> Result.toMaybe


{-| We will fold over room events using this function.
-}
updateGameWith : Matrix.Event.Event -> AccountData -> AccountData
updateGameWith event accountData =
    case decodeRelevantEvent event of
        Nothing ->
            accountData

        Just (Invite { black, white }) ->
            Dict.insert
                (Matrix.Event.eventId event)
                { black = black
                , game =
                    emptyGame
                        { black = black
                        , eventId = Matrix.Event.eventId event
                        , roomId = Matrix.Event.roomId event
                        , white = white
                        }
                , lastMove = Matrix.Event.eventId event
                , lastUpdatedAt = Matrix.Event.originServerTs event
                , white = white
                }
                accountData

        Just (Accept _) ->
            accountData

        -- TODO
        Just (Reject { relatedTo }) ->
            -- Remove game from account data,
            -- but only if nothing has happened yet.
            Dict.update relatedTo
                (Maybe.andThen
                    (\state ->
                        if Game.moves state.game == [] then
                            Nothing

                        else
                            -- Otherwise, it counts as a resignation.
                            Just
                                { state
                                    | game =
                                        state.game
                                            |> Game.toPgn
                                            |> (++)
                                            |> (|>)
                                                (if Matrix.Event.sender event == state.black then
                                                    " 1-0"

                                                 else
                                                    " 0-1"
                                                )
                                            |> Game.fromPgn
                                            |> Maybe.withDefault state.game
                                }
                    )
                )
                accountData

        Just (Leave { relatedTo }) ->
            Dict.update relatedTo
                (Maybe.map
                    (\state ->
                        { state
                            | game =
                                state.game
                                    |> Game.toPgn
                                    |> (++)
                                    |> (|>)
                                        (if Matrix.Event.sender event == state.black then
                                            " 1-0"

                                         else
                                            " 0-1"
                                        )
                                    |> Game.fromPgn
                                    |> Maybe.withDefault state.game
                        }
                    )
                )
                accountData

        -- Register a move
        Just (Move { newGame, lastMove, relatedTo }) ->
            Dict.update relatedTo
                (Maybe.map
                    (\state ->
                        if isAllowedToMove (Matrix.Event.sender event) state then
                            if state.lastMove == lastMove then
                                if isOneMoreMove state.game newGame then
                                    { state
                                        | game = newGame
                                        , lastMove = Matrix.Event.eventId event
                                        , lastUpdatedAt = Matrix.Event.originServerTs event
                                    }

                                else
                                    state

                            else
                                state

                        else
                            state
                    )
                )
                accountData


{-| The pilatch/elm-chess library supports a default room loadout.
However, it does not support adding tags to the start of the game.
For this reason, we will create our own using the information available.
-}
emptyGame : { black : String, eventId : String, roomId : String, white : String } -> Game.Game
emptyGame { black, eventId, roomId, white } =
    [ "[Event \""
    , eventId
    , "\"]\n[Site \""
    , roomId
    , "\"]\n[Black \""
    , black
    , "\"]\n[White \""
    , white
    , "\"]\n\n*"
    ]
        |> List.map (String.replace "\"" "\\\"")
        |> String.join ""
        |> Game.fromPgn
        |> Maybe.withDefault Game.empty


{-| Import account data from the Matrix room.
-}
fromAccountData : String -> Matrix.Vault -> AccountData
fromAccountData roomId vault =
    Matrix.getRoomById roomId vault
        |> Maybe.andThen (Matrix.Room.accountData accountDataEventType)
        |> Maybe.map (D.decodeValue accountDataDecoder)
        |> Maybe.andThen Result.toMaybe
        |> Maybe.withDefault Dict.empty


{-| Encode a chess game into a PGN-formatted string.
-}
encodePGN : Game.Game -> E.Value
encodePGN =
    Game.toEnd >> Game.toPgn >> E.string


{-| Decode a PGN-formatted string into a chess game.
-}
pgnDecoder : D.Decoder Game.Game
pgnDecoder =
    D.andThen
        (\pgn ->
            case Game.fromPgn pgn of
                Just game ->
                    D.succeed <| Game.toEnd <| game

                Nothing ->
                    D.fail "Invalid PGN"
        )
        D.string


type alias GameSummary =
    { data : GameState, matchId : String, room : Matrix.Room.Room }


sorted : List GameSummary -> List GameSummary
sorted =
    List.sortBy (.data >> .lastUpdatedAt >> Time.posixToMillis)


{-| This is the only exposed function as it summarizes the entire file.
This function takes a look at the information available to us in our Matrix Vault, and then:

1.  Takes the registered games in the account data
2.  Looks for invites to new games on the timeline
3.  Looks for updates to existing games on the timeline
4.  Summarizes which rooms need their account data updated
5.  Provides a complete list of all games, sorted by the timestamp of their last update

-}
resolve : Matrix.Vault -> { accountDataToUpdate : List { room : Matrix.Room.Room, data : E.Value }, states : List GameSummary }
resolve vault =
    vault
        |> Matrix.getRooms
        |> List.map
            (\room ->
                let
                    accountData : AccountData
                    accountData =
                        fromAccountData (Matrix.Room.roomId room) vault

                    newAccountData : AccountData
                    newAccountData =
                        accountData
                            |> List.foldl updateGameWith
                            |> (|>) (Matrix.Room.mostRecentEvents room)
                in
                { state =
                    newAccountData
                        |> Dict.toList
                        |> List.map (\( matchId, state ) -> { data = state, matchId = matchId, room = room })
                , needsChange =
                    if accountData == newAccountData then
                        Nothing

                    else
                        Just { room = room, data = encodeAccountData newAccountData }
                }
            )
        |> List.foldl
            (\{ state, needsChange } { accountDataToUpdate, states } ->
                { accountDataToUpdate =
                    case needsChange of
                        Nothing ->
                            accountDataToUpdate

                        Just a ->
                            a :: accountDataToUpdate
                , states =
                    List.append state states
                }
            )
            { accountDataToUpdate = [], states = [] }
        |> (\s -> { s | states = sorted s.states })


{-| If you are sure that the games haven't updated (i.e. the Vault hasn't changed)
then you can also use this function to simply get a list of games.

This saves you the computational power needed to go fold every timeline of every room
on every single tiny update.

-}
getGames : Matrix.Vault -> List GameSummary
getGames vault =
    vault
        |> Matrix.getRooms
        |> List.map
            (\room ->
                fromAccountData (Matrix.Room.roomId room) vault
                    |> Dict.toList
                    |> List.map (\( matchId, state ) -> { data = state, matchId = matchId, room = room })
            )
        |> List.concat
        |> sorted


{-| Get a name of the player's opponent.
-}
opponent : Matrix.Vault -> GameSummary -> String
opponent vault { data, room } =
    let
        nameOf : String -> String
        nameOf u =
            Matrix.Room.stateEvent { eventType = "m.room.member", stateKey = u } room
                |> Maybe.map Matrix.Event.content
                |> Maybe.andThen (D.decodeValue (D.field "displayname" D.string) >> Result.toMaybe)
                |> Maybe.withDefault u
    in
    case Matrix.username vault of
        Nothing ->
            data.black

        Just userId ->
            if userId == data.black && userId == data.white then
                "Against yourself"

            else if userId == data.black then
                nameOf data.white

            else
                nameOf data.black


{-| Check whether it is our turn to play.
-}
myTurn : Matrix.Vault -> GameSummary -> Bool
myTurn vault { data } =
    Matrix.username vault
        |> Maybe.map
            (\name ->
                if Position.sideToMove (Game.position (Game.toEnd data.game)) == PieceColor.black then
                    name == data.black

                else
                    name == data.white
            )
        |> Maybe.withDefault False
