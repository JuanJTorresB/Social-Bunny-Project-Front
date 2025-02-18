package com.c3.Social.Bunny.ControllerGeneral;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class RouteController {

    @GetMapping(value = {"/", "/auth", "/profile/**" , "/post/**"})
       public String redirect() {
           return "forward:/index.html";
       }
}
