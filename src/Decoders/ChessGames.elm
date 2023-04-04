module Decoders.ChessGames exposing
    ( ChessGame
    , chessGameDecoder
    , encodeChessGame
    )

{-| Automatically generated 'ChessGames'

Last generated at Unix time 1680087168

-}

import Internal.Tools.EncodeExtra exposing (maybeObject)
import Internal.Tools.Timestamp exposing (Timestamp, encodeTimestamp, timestampDecoder)
import Json.Decode as D
import Json.Encode as E


{-| Account data object that tracks a game of chess in the room.
-}
type alias ChessGame =
    { lastUpdateAt : Timestamp
    , latestEventId : String
    , pgn : String
    , playerBlack : String
    , playerWhite : String
    }


encodeChessGame : ChessGame -> E.Value
encodeChessGame data =
    maybeObject
        [ ( "last_update_at", Just <| encodeTimestamp data.lastUpdateAt )
        , ( "latest_event_id", Just <| E.string data.latestEventId )
        , ( "pgn", Just <| E.string data.pgn )
        , ( "player_black", Just <| E.string data.playerBlack )
        , ( "player_white", Just <| E.string data.playerWhite )
        ]


chessGameDecoder : D.Decoder ChessGame
chessGameDecoder =
    D.map5
        (\a b c d e ->
            { lastUpdateAt = a, latestEventId = b, pgn = c, playerBlack = d, playerWhite = e }
        )
        (D.field "last_update_at" timestampDecoder)
        (D.field "latest_event_id" D.string)
        (D.field "pgn" D.string)
        (D.field "player_black" D.string)
        (D.field "player_white" D.string)
