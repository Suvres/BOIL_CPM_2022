package com.boil.cpm.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;


@Controller
@RequestMapping("/")
public class NodeController {

    @GetMapping("/")
    public String nodeListGet() {

        return "get_node_list";
    }

}
