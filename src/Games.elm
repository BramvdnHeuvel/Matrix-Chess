module Games exposing (..)

{-| This module helps decode all values from the Matrix API.
-}

import Decoders.ChessGames
import Json.Decode as D
import Json.Encode as E
import Matrix
import Matrix.Room


{-| The ChessGames type is one that tracks a game's status.
-}
type alias ChessGames =
    List ChessGame


type alias ChessGame =
    Decoders.ChessGames.ChessGame


chessGamesDecoder : D.Decoder ChessGames
chessGamesDecoder =
    D.list Decoders.ChessGames.chessGameDecoder


encodeChessGames : ChessGames -> E.Value
encodeChessGames =
    E.list Decoders.ChessGames.encodeChessGame


knownGames : Matrix.Vault -> ChessGames
knownGames vault =
    vault
        |> Matrix.getRooms
        |> List.map
            (\room ->
                -- Find all known games in the room
                case Matrix.Room.accountData "me.noordstar.chess_games" room of
                    Nothing ->
                        []

                    Just value ->
                        case D.decodeValue chessGamesDecoder value of
                            Err _ ->
                                []

                            Ok v ->
                                v
            )
        |> List.concat



-- TODO: Look for game invitations
