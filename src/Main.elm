module Main exposing (main)

import Browser
import Element
import Html exposing (Html)
import Http
import Internal.Tools.Exceptions as X
import Matrix
import Model exposing (Model)
import Msg exposing (Msg)
import View
import Task


main =
    Browser.document { init = init, view = view, update = update, subscriptions = subscriptions }



-- MODEL


init : () -> ( Model, Cmd Msg )
init _ =
    ( Model.LoginScreen
        { screen = Model.AccessTokenScreen
        , username = ""
        , password = ""
        , accessToken = ""
        , baseUrl = "https://"
        , error = Nothing
        }
    , Cmd.none
    )



-- UPDATE


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case ( model, msg ) of
        -- Update login credentials
        ( Model.LoginScreen _, Msg.UpdateLogin data ) ->
            ( Model.LoginScreen data, Cmd.none )

        -- Submit login credentials
        ( Model.LoginScreen data, Msg.SubmitLogin ) ->
            let
                vault : Matrix.Vault
                vault =
                    case data.screen of
                        Model.AccessTokenScreen ->
                            Matrix.fromAccessToken
                                { accessToken = data.accessToken
                                , baseUrl = data.baseUrl
                                }

                        Model.UsernameAndPasswordScreen ->
                            Matrix.fromLoginCredentials
                                { baseUrl = data.baseUrl
                                , username = data.username
                                , password = data.password
                                }
            in
            ( Model.InitialSync data vault, Task.attempt Msg.InitialSync (Matrix.sync vault) )

        ( Model.LoginScreen _, _ ) ->
            ( model, Cmd.none )

        -- We receive a response from the Matrix homeserver on whether we have succefully logged in.
        ( Model.InitialSync data vault, Msg.InitialSync result ) ->
            let
                failLoginWith : String -> ( Model, Cmd Msg )
                failLoginWith t =
                    ( Model.LoginScreen { data | error = Just t }, Cmd.none )
            in
                case result of
                    Ok vu ->
                        -- TODO: Implement model here
                        ( model, Cmd.none )

                    Err (X.InternetException Http.NetworkError) ->
                        failLoginWith "You have a bad (or no) internet connection. Please try again." 

                    Err (X.InternetException Http.Timeout) ->
                        failLoginWith "Connection timed out. The server is overloaded or your connection is bad." 

                    Err (X.ServerException (X.M_FORBIDDEN {error})) ->
                        error
                            |> Maybe.map ((++) "Login failed: ")
                            |> Maybe.withDefault "Failed to login! Invalid login credentials"
                            |> failLoginWith
                    
                    Err (X.ServerException (X.M_UNKNOWN_TOKEN { error })) ->
                        error
                            |> Maybe.map ((++) "Unknown token: ")
                            |> Maybe.withDefault "The homeserver did not recognize your login credentials."
                            |> failLoginWith
                    
                    Err (X.ServerException (X.M_UNAUTHORIZED { error })) ->
                        error
                            |> Maybe.map ((++) "Unauthorized: ")
                            |> Maybe.withDefault "Server did not authorize login"
                            |> failLoginWith

                    Err (X.SDKException (X.ServerReturnsBadJSON _)) ->
                        failLoginWith "The homeserver returns bad JSON - are you sure you're pointing to a Matrix server?"
                    
                    Err (X.SDKException X.NoAccessToken) ->
                        failLoginWith "Access token rejected by homeserver"

                    Err X.UnsupportedSpecVersion ->
                        failLoginWith "The homeserver and this SDK are incompatible - they do not have any shared versions."

                    _ ->
                        failLoginWith "An unknown error has occurred."

        -- Ignore any other updates while waiting for the homeserver's response
        ( Model.InitialSync _ _, _ ) ->
            ( model, Cmd.none )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    case model of
        Model.LoginScreen _ ->
            Sub.none
        Model.InitialSync _ _ ->
            Sub.none



-- VIEW


view : Model -> Browser.Document Msg
view model =
    { title = "Matrix chess"
    , body =
        (case model of
            Model.LoginScreen data ->
                View.loginScreen data True
            Model.InitialSync data _ ->
                View.loginScreen data False
        )
            |> Element.layout [ Element.centerX ]
            |> List.singleton
    }
