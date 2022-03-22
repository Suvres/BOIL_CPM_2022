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
        Node root = new Node();
        List<Node> nodes = new ArrayList<>();
        nodes.add(root);

        root.setId(nodeId);
        nodeId++;


        for(Action action: actions){

            //if no predecessors add action to root
            if(action.getPredecessors() == null){
                root.addActionsOut(action);
                continue;
            }
            if(action.getPredecessors().length == 0){
                root.addActionsOut(action);
                continue;
            }


            int tempNodeId=0;

            //find if there is predecessor with end node
            for(String actionName : action.getPredecessors()){
                int index = actionNames.indexOf(actionName);

                if(actions[index].getEndNode() != null){
                    tempNodeId=actions[index].getEndNode().getId();
                }
            }

            Node newNode = new Node();

            if(tempNodeId == 0){
                newNode.setId(nodeId);
                nodes.add(newNode);
                nodeId++;
            }
            else
                newNode = nodes.get(tempNodeId);

            //if yes connect all predecessors to it, else make new node
            for(String actionName : action.getPredecessors()){
                int index = actionNames.indexOf(actionName);

                if(tempNodeId==0){
                    actions[index].setEndNode(newNode);
                }
                else
                    actions[index].setEndNode(nodes.get(tempNodeId));

            }

            //add action to used node
            if(tempNodeId == 0){
                nodes.get(nodes.size()-1).addActionsOut(action);
            }
            else
                nodes.get(tempNodeId).addActionsOut(action);

        }

        //end node
        Node endNode = new Node();
        endNode.setId(nodeId);

        for(Action action: actions){
            if(action.getEndNode() == null)
                action.setEndNode(endNode);
        }

        nodes.add(endNode);


        int virtualNodeIds =-1;

        //if there is a node with actions ending on the same node reconnect the sorter action via virtual node and action
        for(Node node: nodes){

            for(Action action1 : node.getActionsOut()){

                for(Action action2: node.getActionsOut()){

                    if(action1.getEndNode() == action2.getEndNode() && action1 != action2){
                        Node virtualNode = new Node();
                        Action virtualAction = new Action();
                        virtualNode.setId(virtualNodeIds);
                        virtualNodeIds--;
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

        return root;
    }



}
