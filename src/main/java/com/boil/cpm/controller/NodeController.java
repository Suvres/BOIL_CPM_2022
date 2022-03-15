package com.boil.cpm.controller;


import com.boil.cpm.entities.Node;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.extern.java.Log;
import org.springframework.stereotype.Controller;
import org.springframework.util.MultiValueMap;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@Controller
@RequestMapping("/")
public class NodeController {

    @GetMapping("/")
    public String nodeListGet() {

        return "get_node_list";
    }

    @PostMapping("/calculate")
    public String nodeListPost(@RequestBody MultiValueMap<String, String> values, BindingResult result) {
            if(result.hasErrors()) {
            return "error";
        }

        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        String json = values.get("data").get(0);

        List<Node> nodes;
        try {
             nodes = mapper.readValue(json, mapper.getTypeFactory().constructCollectionType(List.class, Node.class));
        } catch (IOException e) {
            e.printStackTrace();
        }

        // TODO OBSŁUGA NODÓW

        return "nodes_cpm";
    }



}
