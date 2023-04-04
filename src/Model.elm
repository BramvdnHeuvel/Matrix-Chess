module Model exposing (..)

import Chess exposing (GameSummary)
import Matrix
import Matrix.Room
import Square
import Time


type Model
    = LoginScreen LoginData
    | InitialSync LoginData Matrix.Vault
    | LoggedIn Matrix.Vault LoggedInModel


type alias LoginData =
    { screen : LoginSelection
    , username : String
    , password : String
    , accessToken : String
    , baseUrl : String
    , error : Maybe String
    }


type LoginSelection
    = UsernameAndPasswordScreen
    | AccessTokenScreen


type alias LoggedInModel =
    GameScreen


type GameScreen
    = BrowsingGames (Maybe ModalScreen)
    | PlayGame
        (Maybe ModalScreen)
        { game : GameSummary
        , selected : Maybe Square.Square
        , mayMoveBlack : Bool
        , mayMoveWhite : Bool
        }


type ModalScreen
    = CreateGame { username : String, room : Maybe Matrix.Room.Room }


{-| Account data object that tracks a game of chess in the room.
-}
type alias ChessGame =
    { lastUpdateAt : Time.Posix
    , latestEventId : String
    , pgn : String
    , playerBlack : String
    , playerWhite : String
    }
