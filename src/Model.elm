module Model exposing (..)

import Matrix


type Model
    = LoginScreen LoginData
    | InitialSync LoginData Matrix.Vault


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
