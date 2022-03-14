package com.boil.cpm.entities;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Getter
@Setter
public class Node {

    private int id;

    private LocalDateTime start, finish;

    private int timeGapInHours;

    private List<Action> actionsIn, actionsOut;

    public Node() {
    }

    public void addActionsIn(Action action){
        if(actionsIn==null)
            actionsIn = new ArrayList<>();

        actionsIn.add(action);
    }


    public void addActionsOut(Action action){
        if(actionsOut == null)
            actionsOut = new ArrayList<>();

        actionsOut.add(action);
    }

}
