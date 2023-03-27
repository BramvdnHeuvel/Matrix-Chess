module View exposing (..)

import Element exposing (Element)
import Element.Input as Input
import Material.Icons as Icons
import Material.Icons.Types as T
import Model
import Msg exposing (Msg)
import StringExtra as S
import Widget
import Widget.Icon
import Widget.Material as Material
import Element.Background
import Element.Font

{-| Field that lets you fill in a password. -}
accessTokenField : Model.LoginData -> Bool -> Element Msg
accessTokenField model editable =
    Widget.currentPasswordInputV2
        (Material.passwordInput Material.defaultPalette)
        { text = model.accessToken
        , placeholder = 
            Element.text "Access token"
            |> Input.placeholder []
            |> Just
        , label = "Access token"
        , onChange =
            \accessToken ->
                if editable then
                    Msg.UpdateLogin { model | accessToken = accessToken }
                else
                    Msg.UpdateLogin model
        , show = False
        }
    |> Element.el
        [ Element.centerX ]

{-| Field that lets you fill in a baseUrl. -}
baseUrlField : Model.LoginData -> Bool -> Element Msg
baseUrlField model editable =
    Widget.textInput
        (Material.textInput Material.defaultPalette)
        { chips = []
        , text = model.baseUrl
        , placeholder = 
            Element.text "Homeserver URL"
            |> Input.placeholder []
            |> Just
        , label = "Homeserver URL"
        , onChange =
            \baseUrl ->
                if editable then
                    Msg.UpdateLogin { model | baseUrl = S.withHttps baseUrl }
                else
                    Msg.UpdateLogin model
        }
    |> Element.el
        [ Element.centerX ]

{-| Place an error message. -}
errorMessage : Maybe String -> Element msg
errorMessage error =
    case error of
        Nothing ->
            Element.none
        
        Just e ->
            Element.el
                [ Element.width Element.fill
                , Element.Background.color (Element.rgb 1 0 0)
                , Element.Font.color (Element.rgb 1 1 1)
                , Element.padding 5
                ]
                ( Element.text e )

{-| Get an icon from the Material library
-}
getIcon : T.Icon msg -> Widget.Icon.Icon msg
getIcon =
    Widget.Icon.elmMaterialIcons T.Color

{-| View when logging in, or when trying to authenticate.
-}
loginScreen : Model.LoginData -> Bool -> Element Msg
loginScreen model editable =
    Widget.tab
        (Material.tab Material.defaultPalette)
        { tabs =
            { selected =
                case model.screen of
                    Model.AccessTokenScreen ->
                        Just 0
                    Model.UsernameAndPasswordScreen ->
                        Just 1
            , options =
                [ { text = "Access token", icon = getIcon Icons.local_activity }
                , { text = "Username & password", icon = getIcon Icons.password }
                ]
            , onSelect =
                \i ->
                    case i of
                        0 ->
                            Just (Msg.UpdateLogin { model | screen = Model.AccessTokenScreen })
                        1 ->
                            Just (Msg.UpdateLogin { model | screen = Model.UsernameAndPasswordScreen })
                        _ ->
                            Nothing
            }
        , content =
            \i ->
                (case i of
                    Just 0 ->
                        [ errorMessage model.error
                        , baseUrlField model editable
                        , accessTokenField model editable
                        , submitField model editable
                        ]
                    Just 1 ->
                        [ errorMessage model.error
                        , baseUrlField model editable
                        , usernameField model editable
                        , passwordField model editable
                        , submitField model editable
                        ]
                    _ ->
                        [ errorMessage model.error
                        , baseUrlField model editable
                        , accessTokenField model editable
                        , submitField model editable
                        ]
                )
                |> Element.column
                    [ Element.centerX
                    , Element.spacing 20
                    ]
        }

{-| Field that lets you fill in a password. -}
passwordField : Model.LoginData -> Bool -> Element Msg
passwordField model editable =
    Widget.currentPasswordInputV2
        (Material.passwordInput Material.defaultPalette)
        { text = model.password
        , placeholder = 
            Element.text "Password"
            |> Input.placeholder []
            |> Just
        , label = "Password"
        , onChange =
            \password ->
                if editable then
                    Msg.UpdateLogin { model | password = password }
                else
                    Msg.UpdateLogin model
        , show = False
        }
    |> Element.el
        [ Element.centerX ]

{-| Field that lets you submit your credentials when you'd like to log in. -}
submitField : Model.LoginData -> Bool -> Element Msg
submitField model submittable =
    let
        hideButton : Bool
        hideButton =
            if String.length model.baseUrl > S.httpsLen then
                case model.screen of
                    Model.AccessTokenScreen ->
                        String.length model.accessToken == 0
                    Model.UsernameAndPasswordScreen ->
                        (String.length model.username) * (String.length model.password) == 0
            else
                True
    in
        Widget.textButton
            (Material.outlinedButton Material.defaultPalette)
            { text = "Login"
            , onPress =
                if submittable then
                    Just Msg.SubmitLogin
                else
                    Nothing
            }
        |> Element.el [ Element.transparent hideButton, Element.centerX ]

{-| Field that lets you fill in a username. -}
usernameField : Model.LoginData -> Bool -> Element Msg
usernameField model editable =
    Widget.usernameInput
        (Material.textInput Material.defaultPalette)
        { chips = []
        , text = model.username
        , placeholder = 
            Element.text "Username"
            |> Input.placeholder []
            |> Just
        , label = "Username"
        , onChange =
            \username ->
                if editable then
                    Msg.UpdateLogin { model | username = username }
                else
                    Msg.UpdateLogin model
        }
    |> Element.el
        [ Element.centerX ]


