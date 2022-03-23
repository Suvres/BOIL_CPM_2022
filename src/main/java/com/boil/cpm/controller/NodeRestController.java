package com.boil.cpm.controller;

import com.boil.cpm.entities.Action;
import com.boil.cpm.entities.Node;
import com.boil.cpm.service.NodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
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
    public Node nodeListPost(@RequestBody List<Action> actions) {
        return nodeService.buildNetwork(actions.toArray(new Action[0]));
    }
}
