package com.boil.cpm.controller;

import com.boil.cpm.entities.Action;
import com.boil.cpm.entities.Node;
import com.boil.cpm.service.NodeService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/")
public class NodeRestController {

    private final NodeService nodeService;

    @Autowired
    public NodeRestController(NodeService nodeService) {
        this.nodeService = nodeService;
    }

    @PostMapping(value = "/calculate", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity nodeListPost(@RequestBody List<Action> actions) {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        mapper.configure(SerializationFeature.WRITE_DATE_TIMESTAMPS_AS_NANOSECONDS, false);
        mapper.enable(SerializationFeature.INDENT_OUTPUT);

        Node n = nodeService.buildNetwork(actions.toArray(new Action[0]));
        String json;
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.add("Content-Type", "application/json");
        try {
            json = mapper.writeValueAsString(n);
        } catch (JsonProcessingException e) {

            return new ResponseEntity("[]", responseHeaders, HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity(json, responseHeaders, HttpStatus.OK);
    }
}
