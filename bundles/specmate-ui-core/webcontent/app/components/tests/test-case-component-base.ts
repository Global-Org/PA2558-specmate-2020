import { Id } from '../../util/Id';
import { Config } from '../../config/config';
import { ConfirmationModal } from '../core/forms/confirmation-modal.service';
import { Type } from '../../util/Type';
import { ParameterAssignment } from '../../model/ParameterAssignment';
import { IContentElement } from '../../model/IContentElement';
import { TestParameter } from '../../model/TestParameter';
import { TestCase } from '../../model/TestCase';
import { TestProcedure } from '../../model/TestProcedure';
import { SpecmateDataService } from '../../services/specmate-data.service';
import { OnInit, Component, Input } from '@angular/core';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { Url } from '../../util/Url';
import { IContainer } from '../../model/IContainer';

export class TestCaseComponentBase implements OnInit {

    /** The test case to display */
    @Input()
    testCase: TestCase;

    /** Input Parameters of the test specfication that should be shown*/
    @Input()
    inputParameters: TestParameter[];

    /** Output Parameters of the test specfication that should be shown*/
    @Input()
    outputParameters: TestParameter[];

    /** All contents of the test case */
    protected contents:IContentElement[];

    /** The parameter assignments of this testcase */
    protected assignments: ParameterAssignment[];

    /** Maps parameter url to assignments for this paraemter */
    protected assignmentMap: { [key: string]: ParameterAssignment };

    /** constructor */
    constructor(protected dataService: SpecmateDataService) { }

    ngOnInit() {
        this.loadContents();
    }

    /** We initialize the assignments here. */
    public loadContents(virtual?: boolean): void {
        this.dataService.readContents(this.testCase.url, virtual).then((
            contents: IContainer[]) => {
            this.contents=contents;
            this.assignments = contents.filter(c => Type.is(c, ParameterAssignment)).map(c => <ParameterAssignment>c);
            this.assignmentMap = this.deriveAssignmentMap(this.assignments);
        });
    }

    /** Derives the parameter assignments matching to the display parameters in the right order */
    private deriveAssignmentMap(assignments: ParameterAssignment[]): { [key: string]: ParameterAssignment } {
        let assignmentMap = {};
        for (let assignment of this.assignments) {
            assignmentMap[assignment.parameter.url] = assignment;
        }
        return assignmentMap;
    }
}