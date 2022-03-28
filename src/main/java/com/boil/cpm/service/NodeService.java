package com.boil.cpm.service;

import com.boil.cpm.entities.Action;
import com.boil.cpm.entities.Node;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;
import java.util.TreeMap;

@Service
public class NodeService {

    @PostConstruct
    public void test(){

        Action A = new Action("A", 5, new String[]{});
        Action B = new Action("B", 3, new String[]{"A"});
        Action C = new Action("C", 4, new String[]{});
        Action D = new Action("D", 6, new String[]{"A"});
        Action E = new Action("E", 4, new String[]{"D"});
        Action F = new Action("F", 3, new String[]{"B", "C", "D"});

        Action[] actions = new Action[]{A,B,C,D,E,F};

        System.out.println(buildNetwork(actions));

    }

    public Node buildNetwork(Action[] actions){


        List<String> actionNames = new ArrayList<>();

        //list used for action - actionName relationship
        for(int i=0;i<actions.length;i++){

            actionNames.add(actions[i].getName());

        }

        int nodeId = 0;
        List<Node> nodes = new ArrayList<>();

        for(Action action: actions){

            Node samePredecessors = new Node(nodeId);
            samePredecessors.addActionsOut(action);

            boolean alreadyExists = false;
            for(Node node : nodes){

                if(node.getActionsOut().contains(action) && node.getId() != nodeId) {
                    alreadyExists = true;
                    break;
                }

            }

            if(alreadyExists)
                continue;


            for(Action action2 : actions){

                if(action == action2)
                    continue;

                if(action.getPredecessors().length != action2.getPredecessors().length)
                    continue;

                boolean hasSamePredecessors = true;

                for(int i=0;i<action.getPredecessors().length;i++){

                    if(!action.getPredecessors()[i].equals(action2.getPredecessors()[i])){
                        hasSamePredecessors=false;
                    }

                }

                if(hasSamePredecessors)
                    samePredecessors.addActionsOut(action2);

            }

            nodes.add(samePredecessors);
            nodeId++;
        }

        int virtualNodeId = -1;

        for(Node node : nodes){

            if(node.getActionsOut().get(0).getPredecessors().length==0)
                continue;


            for(String predecessor : node.getActionsOut().get(0).getPredecessors()){

                for(Node node1 : nodes){

                    if(node == node1)
                        continue;

                    for(Action action : node1.getActionsOut()){

                        if(action.getName().equals(predecessor)){

                            if(action.getEndNode() == null){
                                action.setEndNode(node);
                                break;
                            }

                            if(action.getEndNode().getId() < 0){

                                Action tempAction = new Action();
                                tempAction.setEndNode(node);
                                tempAction.setName("Virtual_"+action.getName());

                                action.getEndNode().addActionsOut(tempAction);
                                break;
                            }

                            Node virtualNode = new Node(virtualNodeId);
                            virtualNodeId--;
                            Action tempAction = new Action(), tempAction2 = new Action();
                            tempAction.setEndNode(node);
                            tempAction2.setEndNode(action.getEndNode());
                            tempAction.setName("Virtual_"+action.getName());
                            tempAction2.setName("Virtual_"+action.getName());
                            virtualNode.addActionsOut(tempAction);
                            virtualNode.addActionsOut(tempAction2);

                            action.setEndNode(virtualNode);
                            break;
                        }
                    }
                }
            }
        }


        //end node
        Node endNode = new Node();
        endNode.setId(nodeId);

        for(Action action: actions){
            if(action.getEndNode() == null)
                action.setEndNode(endNode);
        }

        nodes.add(endNode);


        //if there is a node with actions ending on the same node reconnect the sorter action via virtual node and action
        for(Node node: nodes){

            for(Action action1 : node.getActionsOut()){

                for(Action action2: node.getActionsOut()){

                    if(action1.getEndNode() == action2.getEndNode() && action1 != action2){
                        Node virtualNode = new Node();
                        Action virtualAction = new Action();
                        virtualNode.setId(virtualNodeId);
                        virtualNodeId--;
                        virtualNode.addActionsOut(virtualAction);

                        if(action1.getDurationInHours() <= action2.getDurationInHours()){
                            virtualAction.setEndNode(action1.getEndNode());
                            virtualAction.setName("Virtual_"+action1.getName());
                            action1.setEndNode(virtualNode);
                        }
                        else{
                            virtualAction.setEndNode(action2.getEndNode());
                            virtualAction.setName("Virtual_"+action2.getName());
                            action2.setEndNode(virtualNode);
                        }

                    }
                }
            }

        }

        return nodes.get(0);
    }



}
