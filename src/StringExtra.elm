module StringExtra exposing (httpsLen, withHttps)

{-| Make sure that a string starts with <https://>
-}


httpsLen : Int
httpsLen =
    String.length "https://"


withHttps : String -> String
withHttps text =
    case text of
        "h" ->
            "https://"

        "ht" ->
            "https://"

        "htt" ->
            "https://"

        "http" ->
            "https://"

        "https" ->
            "https://"

        "https:" ->
            "https://"

        "https:/" ->
            "https://"

        "https://" ->
            "https://"

        "http://" ->
            "http://"

        _ ->
            if String.startsWith "https://" text then
                text
                    |> String.dropLeft 8
                    |> filterHttps

            else if String.startsWith "http://" text then
                text

            else
                "https://" ++ text


filterHttps : String -> String
filterHttps text =
    if String.startsWith "https://" text then
        text
            |> String.dropLeft 8
            |> withHttps

    else if String.startsWith "http://" text then
        text

    else
        "https://" ++ text
